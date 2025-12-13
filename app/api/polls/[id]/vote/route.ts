import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';
import { redis } from '@/lib/redis';
import { hashIP } from '@/lib/poll-helpers';
import { validateOptionIndex } from '@/lib/validators';
import type { Poll, VoteRequest, VoteResponse } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = params.id;
    const body: VoteRequest = await request.json();
    const { optionIndex } = body;

    const pollKey = `poll:${pollId}`;
    const votersKey = `poll:${pollId}:voters`;

    // Fetch poll data
    const pollData = await redis.hgetall(pollKey);

    if (!pollData || !pollData.id) {
      return NextResponse.json(
        { error: 'Poll not found', code: 'POLL_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Parse poll data - handle both string and already-parsed data
    const poll: Poll = {
      id: pollData.id as string,
      question: pollData.question as string,
      options: typeof pollData.options === 'string'
        ? JSON.parse(pollData.options)
        : Array.isArray(pollData.options)
          ? pollData.options
          : [],
      votes: typeof pollData.votes === 'string'
        ? JSON.parse(pollData.votes)
        : Array.isArray(pollData.votes)
          ? pollData.votes
          : [],
      createdAt: pollData.createdAt as string
    };

    // Validate option index
    const indexValidation = validateOptionIndex(optionIndex, poll.options.length);
    if (!indexValidation.isValid) {
      return NextResponse.json(
        { error: indexValidation.error, code: 'INVALID_OPTION' },
        { status: 400 }
      );
    }

    // Get or create voter ID
    const cookieStore = cookies();
    let voterId = cookieStore.get('poll_voter_id')?.value;

    if (!voterId) {
      voterId = nanoid(16);
    }

    // Get IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const hashedIp = await hashIP(ip);

    // Check if user has already voted
    const hasVotedWithCookie = (await redis.sismember(votersKey, voterId)) === 1;
    const hasVotedWithIp = (await redis.sismember(votersKey, hashedIp)) === 1;

    if (hasVotedWithCookie || hasVotedWithIp) {
      return NextResponse.json(
        { error: 'You have already voted on this poll', code: 'ALREADY_VOTED' },
        { status: 403 }
      );
    }

    // Increment vote count
    poll.votes[optionIndex] += 1;

    // Update poll in Redis
    await redis.hset(pollKey, {
      votes: JSON.stringify(poll.votes)
    });

    // Add voter to voters set
    await redis.sadd(votersKey, voterId, hashedIp);

    // Set expiration on voters set (30 days)
    await redis.expire(votersKey, 2592000);

    // Calculate total votes
    const totalVotes = poll.votes.reduce((sum, count) => sum + count, 0);

    // Set cookie
    const response = NextResponse.json({
      success: true,
      totalVotes
    } as VoteResponse);

    response.cookies.set('poll_voter_id', voterId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2592000 // 30 days in seconds
    });

    return response;
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json(
      { error: 'Failed to submit vote', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

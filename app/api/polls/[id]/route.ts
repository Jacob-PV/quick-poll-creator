import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redis } from '@/lib/redis';
import { hashIP } from '@/lib/poll-helpers';
import type { Poll, GetPollResponse } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = params.id;
    const pollKey = `poll:${pollId}`;

    // Fetch poll data from Redis
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

    // Check if user has voted
    const cookieStore = cookies();
    const voterId = cookieStore.get('poll_voter_id')?.value;

    // Get IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const hashedIp = await hashIP(ip);

    const votersKey = `poll:${pollId}:voters`;

    let hasVoted = false;
    if (voterId) {
      hasVoted = (await redis.sismember(votersKey, voterId)) === 1;
    }

    if (!hasVoted) {
      hasVoted = (await redis.sismember(votersKey, hashedIp)) === 1;
    }

    const response: GetPollResponse = {
      poll,
      hasVoted
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching poll:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poll', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

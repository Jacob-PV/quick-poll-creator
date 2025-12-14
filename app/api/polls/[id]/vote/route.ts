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
    const { optionIndex, optionIndices } = body;

    const pollKey = `poll:${pollId}`;
    const votersKey = `poll:${pollId}:voters`;
    const votersHashKey = `poll:${pollId}:voter_choices`;

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
      createdAt: pollData.createdAt as string,
      allowMultipleChoices: pollData.allowMultipleChoices === 'true' || pollData.allowMultipleChoices === true,
      maxChoices: pollData.maxChoices ? parseInt(pollData.maxChoices as string, 10) : undefined
    };

    // Determine if this is a multiple choice vote
    const isMultipleChoice = poll.allowMultipleChoices && optionIndices && optionIndices.length > 0;
    const indices = isMultipleChoice ? optionIndices! : [optionIndex!];

    // Validate option indices
    for (const idx of indices) {
      const indexValidation = validateOptionIndex(idx, poll.options.length);
      if (!indexValidation.isValid) {
        return NextResponse.json(
          { error: indexValidation.error, code: 'INVALID_OPTION' },
          { status: 400 }
        );
      }
    }

    // Validate max choices for multiple choice polls
    if (isMultipleChoice && poll.maxChoices && indices.length > poll.maxChoices) {
      return NextResponse.json(
        { error: `You can select a maximum of ${poll.maxChoices} options`, code: 'TOO_MANY_OPTIONS' },
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
    const hasVoted = hasVotedWithCookie || hasVotedWithIp;

    // Get previous vote if exists - check both voterId and hashedIp
    let previousVote: { optionIndex?: number; optionIndices?: number[] } | null = null;
    if (hasVoted) {
      // Try voterId first if it exists
      let voteDataStr = voterId ? await redis.get(`${votersHashKey}:${voterId}`) : null;

      // If not found with voterId and we have hashedIp, try that
      if (!voteDataStr && hashedIp) {
        voteDataStr = await redis.get(`${votersHashKey}:${hashedIp}`);
      }

      if (voteDataStr) {
        try {
          previousVote = JSON.parse(voteDataStr as string);
        } catch (e) {
          console.error('Error parsing previous vote:', e);
          console.log('Corrupt vote data detected - treating as new voter');
          // Remove corrupt data from voters set so they're treated as a new voter
          await redis.srem(votersKey, voterId, hashedIp);
          await redis.del(`${votersHashKey}:${voterId}`, `${votersHashKey}:${hashedIp}`);
        }
      }
    }

    // If user has voted before, decrement previous vote(s)
    if (previousVote) {
      console.log('Vote change detected:', {
        pollId,
        voterId,
        hashedIp,
        previousVote,
        newVote: isMultipleChoice ? optionIndices : optionIndex,
        votesBefore: JSON.stringify(poll.votes)
      });

      if (previousVote.optionIndices) {
        // Decrement all previously selected options
        for (const idx of previousVote.optionIndices) {
          if (poll.votes[idx] > 0) {
            poll.votes[idx] -= 1;
          }
        }
      } else if (previousVote.optionIndex !== undefined) {
        // Decrement single previous option
        if (poll.votes[previousVote.optionIndex] > 0) {
          poll.votes[previousVote.optionIndex] -= 1;
        }
      }

      console.log('Votes after decrement:', JSON.stringify(poll.votes));
    }

    // Increment new vote count(s)
    for (const idx of indices) {
      poll.votes[idx] += 1;
    }

    console.log('Votes after increment:', JSON.stringify(poll.votes));

    // Update poll in Redis
    await redis.hset(pollKey, {
      votes: JSON.stringify(poll.votes)
    });

    console.log('Votes saved to Redis for poll', pollId);

    // Store vote choice with voter data
    const voteData = {
      timestamp: new Date().toISOString(),
      ...(isMultipleChoice ? { optionIndices: indices } : { optionIndex: indices[0] })
    };

    // Store vote choice for both voterId and hashedIp
    const voteDataString = JSON.stringify(voteData);

    console.log('Storing vote data:', { voterId, hashedIp, voteDataString });

    // Use SET with composite keys instead of HSET to avoid serialization issues
    await redis.set(`${votersHashKey}:${voterId}`, voteDataString, { ex: 2592000 }); // 30 days
    await redis.set(`${votersHashKey}:${hashedIp}`, voteDataString, { ex: 2592000 });

    console.log('Vote data stored successfully');

    // Add voter to voters set (if not already there)
    await redis.sadd(votersKey, voterId, hashedIp);

    // Set expiration on voters set and voter choices hash (30 days)
    await redis.expire(votersKey, 2592000);
    await redis.expire(votersHashKey, 2592000);

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

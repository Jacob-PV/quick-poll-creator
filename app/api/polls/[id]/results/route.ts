import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { calculateResults } from '@/lib/poll-helpers';
import type { Poll, GetResultsResponse } from '@/types';

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

    // Calculate results with percentages
    const results = calculateResults(poll);

    // Calculate total votes
    const totalVotes = poll.votes.reduce((sum, count) => sum + count, 0);

    const response: GetResultsResponse = {
      results,
      totalVotes,
      poll
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

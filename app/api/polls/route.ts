import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { redis } from '@/lib/redis';
import { validatePollQuestion, validatePollOptions } from '@/lib/validators';
import { generatePollUrl } from '@/lib/poll-helpers';
import type { CreatePollRequest, CreatePollResponse, Poll } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreatePollRequest = await request.json();
    const { question, options } = body;

    // Validate question
    const questionValidation = validatePollQuestion(question);
    if (!questionValidation.isValid) {
      return NextResponse.json(
        { error: questionValidation.error, code: 'INVALID_QUESTION' },
        { status: 400 }
      );
    }

    // Validate options
    const optionsValidation = validatePollOptions(options);
    if (!optionsValidation.isValid) {
      return NextResponse.json(
        { error: optionsValidation.error, code: 'INVALID_OPTIONS' },
        { status: 400 }
      );
    }

    // Generate unique poll ID
    const pollId = nanoid(12);

    // Create poll object
    const poll: Poll = {
      id: pollId,
      question: question.trim(),
      options: options.map(opt => opt.trim()),
      votes: new Array(options.length).fill(0),
      createdAt: new Date().toISOString()
    };

    // Store in Redis with 30 day TTL
    const pollKey = `poll:${pollId}`;
    await redis.hset(pollKey, {
      id: String(poll.id),
      question: String(poll.question),
      options: JSON.stringify(poll.options),
      votes: JSON.stringify(poll.votes),
      createdAt: String(poll.createdAt)
    });

    // Set expiration (30 days in seconds)
    await redis.expire(pollKey, 2592000);

    // Generate shareable URL
    const url = generatePollUrl(pollId);

    const response: CreatePollResponse = {
      pollId,
      url
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { error: 'Failed to create poll', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

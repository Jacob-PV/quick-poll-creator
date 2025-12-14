'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PollQuestion from '@/components/PollQuestion';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { Poll } from '@/types';

export default function PollPage() {
  const params = useParams();
  const router = useRouter();
  const pollId = params.id as string;

  const [poll, setPoll] = useState<Poll | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOption, setVotedOption] = useState<number | null>(null);
  const [votedOptions, setVotedOptions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoll = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/polls/${pollId}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch poll');
      }

      const data = await response.json();
      setPoll(data.poll);
      setHasVoted(data.hasVoted);

      // Set voted option(s) from API response
      if (data.votedOptionIndices) {
        setVotedOptions(data.votedOptionIndices);
      } else if (data.votedOptionIndex !== undefined) {
        setVotedOption(data.votedOptionIndex);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch poll');
    } finally {
      setIsLoading(false);
    }
  }, [pollId]);

  useEffect(() => {
    if (pollId) {
      fetchPoll();
    }
  }, [pollId, fetchPoll]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background py-12 px-4 md:px-8 flex items-center justify-center">
        <LoadingSpinner message="Loading poll..." />
      </main>
    );
  }

  if (error || !poll) {
    return (
      <main className="min-h-screen bg-background py-12 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-text font-semibold mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <ErrorMessage message={error || 'Poll not found'} onRetry={fetchPoll} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <PollQuestion poll={poll} hasVoted={hasVoted} votedOption={votedOption} votedOptions={votedOptions} />
      </div>
    </main>
  );
}

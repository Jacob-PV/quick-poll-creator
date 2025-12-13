'use client';

import { useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoll = async () => {
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

      // If user has voted, find which option they voted for
      if (data.hasVoted && data.poll) {
        // We don't have this info from the API, so we'll just track locally
        // The hasVoted flag is sufficient for the UI
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch poll');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pollId) {
      fetchPoll();
    }
  }, [pollId]);

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

        <PollQuestion poll={poll} hasVoted={hasVoted} votedOption={votedOption} />
      </div>
    </main>
  );
}

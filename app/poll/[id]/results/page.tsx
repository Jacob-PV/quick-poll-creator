'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Home } from 'lucide-react';
import Link from 'next/link';
import ResultsChart from '@/components/ResultsChart';
import PollStats from '@/components/PollStats';
import ShareModal from '@/components/ShareModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { Poll, PollResult } from '@/types';
import { formatNumber } from '@/lib/utils';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const pollId = params.id as string;

  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<PollResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const fetchResults = async () => {
    try {
      setError(null);

      const response = await fetch(`/api/polls/${pollId}/results`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch results');
      }

      const data = await response.json();
      setPoll(data.poll);
      setResults(data.results);
      setTotalVotes(data.totalVotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pollId) {
      fetchResults();

      // Poll for updates every 5 seconds
      const interval = setInterval(fetchResults, 5000);

      return () => clearInterval(interval);
    }
  }, [pollId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background py-12 px-4 md:px-8 flex items-center justify-center">
        <LoadingSpinner message="Loading results..." />
      </main>
    );
  }

  if (error || !poll) {
    return (
      <main className="min-h-screen bg-background py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-text font-semibold mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <ErrorMessage message={error || 'Poll not found'} onRetry={fetchResults} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        {/* Results Header Banner */}
        <div className="bg-gradient-to-br from-primary to-secondary border-5 border-text rounded-[20px] p-12 shadow-brutal-xl text-white text-center mb-12">
          <p className="text-5xl md:text-7xl font-extrabold font-heading leading-none mb-4">
            {formatNumber(totalVotes)}
          </p>
          <p className="text-xl md:text-2xl font-semibold uppercase tracking-wide opacity-90">
            {totalVotes === 1 ? 'Vote' : 'Votes'}
          </p>
        </div>

        {/* Poll Question */}
        <div className="bg-white border-4 border-text rounded-2xl p-8 shadow-brutal-lg mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-text leading-tight">
            {poll.question}
          </h1>
        </div>

        {/* Poll Stats */}
        <PollStats poll={poll} results={results} totalVotes={totalVotes} />

        {/* Results Chart */}
        {results.length > 0 && <ResultsChart results={results} totalVotes={totalVotes} />}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            onClick={() => setShowShareModal(true)}
            className="bg-white border-4 border-text rounded-lg px-7 py-3.5 text-base font-bold text-text shadow-brutal-md cursor-pointer transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_rgba(10,10,10,1)] inline-flex items-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share Poll
          </button>

          <Link
            href={`/poll/${pollId}`}
            className="bg-white border-4 border-text rounded-lg px-7 py-3.5 text-base font-bold text-text shadow-brutal-md cursor-pointer transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_rgba(10,10,10,1)] inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Poll
          </Link>

          <Link
            href="/"
            className="bg-primary border-4 border-text rounded-lg px-7 py-3.5 text-base font-bold text-white shadow-brutal-md cursor-pointer transition-all hover:bg-primary-hover hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_rgba(10,10,10,1)] inline-flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Create New Poll
          </Link>
        </div>

        {/* Share Modal */}
        <ShareModal pollId={pollId} isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
      </div>
    </main>
  );
}

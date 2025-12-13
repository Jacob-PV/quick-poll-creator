'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VoteButton from './VoteButton';
import type { Poll } from '@/types';

interface PollQuestionProps {
  poll: Poll;
  hasVoted: boolean;
  votedOption: number | null;
}

export default function PollQuestion({ poll, hasVoted, votedOption }: PollQuestionProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVote = async () => {
    if (selectedOption === null || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/polls/${poll.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ optionIndex: selectedOption })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit vote');
      }

      // Redirect to results page
      router.push(`/poll/${poll.id}/results`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Poll Header */}
      <div className="bg-white border-4 border-text rounded-2xl p-8 shadow-brutal-lg mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-text leading-tight text-center mb-2">
          {poll.question}
        </h1>
      </div>

      {/* Voted Badge */}
      {hasVoted && votedOption !== null && (
        <div className="bg-success border-3 border-text rounded-lg px-4 py-2 text-sm font-bold inline-flex items-center gap-2 mb-6">
          <span>✓</span>
          <span>You voted for: {poll.options[votedOption]}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-3 border-error rounded-lg px-4 py-3 text-sm font-semibold text-text mb-6">
          {error}
        </div>
      )}

      {/* Options */}
      <div className="flex flex-col gap-4 mb-8">
        {poll.options.map((option, index) => (
          <VoteButton
            key={index}
            text={option}
            isSelected={selectedOption === index}
            isVoted={hasVoted && votedOption === index}
            disabled={hasVoted || isSubmitting}
            onClick={() => !hasVoted && !isSubmitting && setSelectedOption(index)}
          />
        ))}
      </div>

      {/* Submit/View Results Buttons */}
      {!hasVoted ? (
        <button
          onClick={handleVote}
          disabled={selectedOption === null || isSubmitting}
          className="w-full bg-primary border-4 border-text rounded-xl px-12 py-5 text-xl font-bold font-heading text-white shadow-brutal-lg cursor-pointer transition-all hover:bg-primary-hover hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[11px_11px_0px_rgba(10,10,10,1)] active:translate-x-0 active:translate-y-0 active:shadow-brutal-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Vote'}
        </button>
      ) : (
        <button
          onClick={() => router.push(`/poll/${poll.id}/results`)}
          className="w-full bg-secondary border-4 border-text rounded-xl px-12 py-5 text-xl font-bold font-heading text-white shadow-brutal-lg cursor-pointer transition-all hover:bg-secondary-hover hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[11px_11px_0px_rgba(10,10,10,1)] active:translate-x-0 active:translate-y-0 active:shadow-brutal-sm"
        >
          View Results
        </button>
      )}
    </div>
  );
}

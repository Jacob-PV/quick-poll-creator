import { Users, Calendar, List, Trophy } from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/utils';
import { getLeadingOption } from '@/lib/poll-helpers';
import type { Poll, PollResult } from '@/types';

interface PollStatsProps {
  poll: Poll;
  results: PollResult[];
  totalVotes: number;
}

export default function PollStats({ poll, results, totalVotes }: PollStatsProps) {
  const leadingOption = getLeadingOption(poll);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {/* Total Votes */}
      <div className="bg-white border-4 border-text rounded-xl p-6 shadow-brutal-md transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg">
        <div className="w-12 h-12 bg-accent border-3 border-text rounded-lg flex items-center justify-center mb-3">
          <Users className="w-6 h-6 text-text" />
        </div>
        <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
          Total Votes
        </p>
        <p className="text-3xl font-extrabold font-heading text-text leading-tight">
          {formatNumber(totalVotes)}
        </p>
      </div>

      {/* Created Date */}
      <div className="bg-white border-4 border-text rounded-xl p-6 shadow-brutal-md transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg">
        <div className="w-12 h-12 bg-accent border-3 border-text rounded-lg flex items-center justify-center mb-3">
          <Calendar className="w-6 h-6 text-text" />
        </div>
        <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
          Created
        </p>
        <p className="text-base font-bold text-text">
          {formatDate(poll.createdAt)}
        </p>
      </div>

      {/* Number of Options */}
      <div className="bg-white border-4 border-text rounded-xl p-6 shadow-brutal-md transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg">
        <div className="w-12 h-12 bg-accent border-3 border-text rounded-lg flex items-center justify-center mb-3">
          <List className="w-6 h-6 text-text" />
        </div>
        <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
          Options
        </p>
        <p className="text-3xl font-extrabold font-heading text-text leading-tight">
          {poll.options.length}
        </p>
      </div>

      {/* Leading Option */}
      <div className="bg-white border-4 border-text rounded-xl p-6 shadow-brutal-md transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg">
        <div className="w-12 h-12 bg-accent border-3 border-text rounded-lg flex items-center justify-center mb-3">
          <Trophy className="w-6 h-6 text-text" />
        </div>
        <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
          Leading
        </p>
        {leadingOption ? (
          <p className="text-base font-bold text-text line-clamp-2">
            {leadingOption.option}
          </p>
        ) : (
          <p className="text-base font-bold text-text-muted">No votes yet</p>
        )}
      </div>
    </div>
  );
}

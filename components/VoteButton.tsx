'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteButtonProps {
  text: string;
  isSelected: boolean;
  isVoted: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function VoteButton({
  text,
  isSelected,
  isVoted,
  disabled,
  onClick
}: VoteButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full border-4 border-text rounded-xl p-6 text-lg font-semibold font-body',
        'shadow-brutal-md cursor-pointer transition-all duration-250',
        'flex items-center justify-between text-left',
        !disabled && !isVoted && !isSelected && 'bg-white text-text hover:bg-accent hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_rgba(10,10,10,1)]',
        isSelected && !isVoted && 'bg-secondary text-white -translate-x-1 -translate-y-1 shadow-[10px_10px_0px_rgba(10,10,10,1)]',
        isVoted && 'bg-success text-text cursor-default',
        disabled && !isVoted && 'opacity-60 cursor-not-allowed'
      )}
    >
      <span>{text}</span>
      {isVoted && <Check className="w-6 h-6 flex-shrink-0" />}
    </button>
  );
}

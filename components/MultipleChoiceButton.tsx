'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultipleChoiceButtonProps {
  text: string;
  isSelected: boolean;
  isVoted: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function MultipleChoiceButton({
  text,
  isSelected,
  isVoted,
  disabled,
  onClick
}: MultipleChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full border-4 border-solid border-text rounded-xl p-6 text-lg font-semibold font-body',
        'shadow-brutal-md cursor-pointer transition-all duration-250',
        'flex items-center gap-4 text-left',
        !disabled && !isVoted && !isSelected && 'bg-white text-text hover:bg-accent hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_rgba(10,10,10,1)]',
        isSelected && !isVoted && 'bg-secondary text-white -translate-x-1 -translate-y-1 shadow-[10px_10px_0px_rgba(10,10,10,1)]',
        isVoted && 'bg-success text-text',
        disabled && !isVoted && 'opacity-60 cursor-not-allowed'
      )}
    >
      {/* Checkbox */}
      <div
        className={cn(
          'w-6 h-6 border-3 border-text rounded flex items-center justify-center flex-shrink-0',
          isSelected || isVoted ? 'bg-white' : 'bg-background'
        )}
      >
        {(isSelected || isVoted) && <Check className="w-5 h-5 text-text" />}
      </div>

      <span className="flex-1">{text}</span>
    </button>
  );
}

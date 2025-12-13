'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        border-3 border-text rounded-lg px-6 py-3.5 text-base font-bold
        shadow-brutal-md cursor-pointer transition-all flex items-center justify-center gap-2
        ${copied
          ? 'bg-success text-text'
          : 'bg-secondary text-white hover:bg-secondary-hover hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_rgba(10,10,10,1)]'
        }
        active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0px_rgba(10,10,10,1)]
      `}
    >
      {copied ? (
        <>
          <Check className="w-5 h-5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-5 h-5" />
          {label}
        </>
      )}
    </button>
  );
}

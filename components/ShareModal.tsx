'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import CopyButton from './CopyButton';

interface ShareModalProps {
  pollId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ pollId, isOpen, onClose }: ShareModalProps) {
  const pollUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/poll/${pollId}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Vote on my poll!')}&url=${encodeURIComponent(pollUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pollUrl)}`;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border-5 border-text rounded-[20px] shadow-[16px_16px_0px_rgba(10,10,10,1)] p-10 max-w-[560px] w-full relative animate-modal-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 bg-error border-3 border-text rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer text-white text-xl font-bold transition-all hover:rotate-90 hover:bg-red-600"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-extrabold font-heading text-text mb-6 tracking-tight">
          Share This Poll!
        </h2>

        {/* URL Display */}
        <div className="bg-background border-3 border-text rounded-xl p-4 font-mono text-sm text-text break-all mb-4">
          {pollUrl}
        </div>

        {/* Copy Button */}
        <div className="mb-6">
          <CopyButton text={pollUrl} label="Copy Link" />
        </div>

        {/* Social Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => window.open(twitterUrl, '_blank', 'width=550,height=420')}
            className="flex-1 bg-[#000000] border-3 border-text rounded-lg px-5 py-3.5 text-sm font-bold text-white shadow-brutal-sm cursor-pointer transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-md text-center"
          >
            Share on X
          </button>
          <button
            onClick={() => window.open(facebookUrl, '_blank', 'width=550,height=420')}
            className="flex-1 bg-[#4267B2] border-3 border-text rounded-lg px-5 py-3.5 text-sm font-bold text-white shadow-brutal-sm cursor-pointer transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-md text-center"
          >
            Share on Facebook
          </button>
        </div>

        <p className="text-sm text-text-muted text-center">
          Anyone with this link can vote on your poll
        </p>
      </div>
    </div>
  );
}

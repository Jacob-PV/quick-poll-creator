'use client';

import { useState } from 'react';
import { Zap, BarChart3, Share2 } from 'lucide-react';
import CreatePollForm from '@/components/CreatePollForm';
import ShareModal from '@/components/ShareModal';

export default function Home() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [createdPollId, setCreatedPollId] = useState<string | null>(null);

  const handlePollCreated = (pollId: string) => {
    setCreatedPollId(pollId);
    setShowShareModal(true);
  };

  const handleCloseModal = () => {
    setShowShareModal(false);
    // Reset after animation
    setTimeout(() => {
      setCreatedPollId(null);
    }, 300);
  };

  return (
    <main className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-accent to-accent-secondary border-5 border-text rounded-[20px] shadow-brutal-xl p-8 md:p-16 mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold font-heading leading-tight mb-6 bg-gradient-to-br from-text to-secondary bg-clip-text text-transparent">
            Create Polls That Pop!
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-text mb-4">
            No signup. No hassle. Just instant polls with real-time results.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Feature 1 */}
          <div className="bg-white border-4 border-text rounded-2xl p-8 shadow-brutal-lg text-center transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[11px_11px_0px_rgba(10,10,10,1)]">
            <div className="w-16 h-16 bg-accent border-3 border-text rounded-xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-text" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-text mb-3">
              Lightning Fast
            </h3>
            <p className="text-base text-text-muted leading-relaxed">
              Create and share polls in seconds
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border-4 border-text rounded-2xl p-8 shadow-brutal-lg text-center transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[11px_11px_0px_rgba(10,10,10,1)]">
            <div className="w-16 h-16 bg-accent border-3 border-text rounded-xl flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-8 h-8 text-text" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-text mb-3">
              Real-time Results
            </h3>
            <p className="text-base text-text-muted leading-relaxed">
              Watch votes roll in live with beautiful charts
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border-4 border-text rounded-2xl p-8 shadow-brutal-lg text-center transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[11px_11px_0px_rgba(10,10,10,1)]">
            <div className="w-16 h-16 bg-accent border-3 border-text rounded-xl flex items-center justify-center mx-auto mb-6">
              <Share2 className="w-8 h-8 text-text" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-text mb-3">
              Easy Sharing
            </h3>
            <p className="text-base text-text-muted leading-relaxed">
              One click to share anywhere
            </p>
          </div>
        </div>

        {/* Create Poll Form */}
        <CreatePollForm onPollCreated={handlePollCreated} />

        {/* Share Modal */}
        {createdPollId && (
          <ShareModal
            pollId={createdPollId}
            isOpen={showShareModal}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </main>
  );
}

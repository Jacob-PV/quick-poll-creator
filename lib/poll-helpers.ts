import type { Poll, PollResult } from '@/types';

export function calculateResults(poll: Poll): PollResult[] {
  const totalVotes = poll.votes.reduce((sum, count) => sum + count, 0);

  return poll.options.map((option, index) => {
    const votes = poll.votes[index];
    const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

    return {
      option,
      votes,
      percentage: Math.round(percentage * 10) / 10 // Round to 1 decimal place
    };
  });
}

export function generatePollUrl(pollId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/poll/${pollId}`;
}

export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function getTotalVotes(poll: Poll): number {
  return poll.votes.reduce((sum, count) => sum + count, 0);
}

export function getLeadingOption(poll: Poll): { option: string; votes: number } | null {
  const totalVotes = getTotalVotes(poll);
  if (totalVotes === 0) return null;

  let maxVotes = -1;
  let leadingIndex = -1;

  poll.votes.forEach((votes, index) => {
    if (votes > maxVotes) {
      maxVotes = votes;
      leadingIndex = index;
    }
  });

  if (leadingIndex === -1) return null;

  return {
    option: poll.options[leadingIndex],
    votes: maxVotes
  };
}

// Core poll types
export interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: number[];
  createdAt: string;
}

export interface PollResult {
  option: string;
  votes: number;
  percentage: number;
}

// API request/response types
export interface CreatePollRequest {
  question: string;
  options: string[];
}

export interface CreatePollResponse {
  pollId: string;
  url: string;
}

export interface VoteRequest {
  optionIndex: number;
}

export interface VoteResponse {
  success: boolean;
  totalVotes: number;
}

export interface ApiError {
  error: string;
  code: string;
}

// API response types
export interface GetPollResponse {
  poll: Poll;
  hasVoted: boolean;
}

export interface GetResultsResponse {
  results: PollResult[];
  totalVotes: number;
  poll: Poll;
}

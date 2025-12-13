# Quick Poll Creator

A modern, lightning-fast web application for creating and sharing polls with real-time results. Built with Next.js 14, TypeScript, and Upstash Redis, featuring a bold Neo-Brutalist design that makes polling fun and engaging.

## Features

- **Instant Poll Creation** - No signup required, create polls in seconds
- **Real-time Results** - Watch votes come in live with beautiful chart visualizations
- **Easy Sharing** - One-click sharing with direct links, Twitter, and Facebook
- **Vote Prevention** - Cookie and IP-based duplicate vote prevention
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Accessible** - WCAG AA compliant with full keyboard navigation support
- **Bold UI** - Neo-Brutalist design with vibrant colors and strong visual hierarchy

## Tech Stack

- **Framework**: Next.js 14.0.4 with App Router
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4 with custom design tokens
- **Database**: Upstash Redis (serverless Redis)
- **Charts**: Recharts 2.10
- **Icons**: Lucide React 0.294
- **Deployment**: Optimized for Vercel

## Prerequisites

- **Node.js** 18+ installed
- **Upstash Redis** account (free tier available)
- **npm** or **yarn** package manager

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd quick-poll-creator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Upstash Redis

1. Go to [console.upstash.com](https://console.upstash.com)
2. Create a new Redis database (free tier available)
3. Copy your REST URL and REST Token from the database dashboard

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=AYKGASQgMDQ4...

# Application URL (for generating shareable links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production deployment, update `NEXT_PUBLIC_APP_URL` to your production domain.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

## How to Use

### Creating a Poll

1. Navigate to the home page
2. Enter your poll question (max 200 characters)
3. Add 2-10 poll options (max 100 characters each)
4. Click "Create Poll"
5. Share the generated link with voters

### Voting on a Poll

1. Open the poll link shared with you
2. Select your preferred option
3. Click "Submit Vote"
4. View real-time results

### Viewing Results

1. After voting, you're automatically redirected to results
2. See vote distribution in an interactive bar chart
3. View total votes, creation date, and leading option
4. Share results with others

## Project Structure

```
quick-poll-creator/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── polls/
│   │       ├── route.ts          # Create poll endpoint
│   │       └── [id]/
│   │           ├── route.ts      # Get poll endpoint
│   │           ├── vote/         # Submit vote endpoint
│   │           └── results/      # Get results endpoint
│   ├── poll/[id]/               # Poll pages
│   │   ├── page.tsx             # Voting page
│   │   └── results/
│   │       └── page.tsx         # Results page
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── CreatePollForm.tsx       # Poll creation form
│   ├── PollQuestion.tsx         # Voting interface
│   ├── VoteButton.tsx           # Individual vote button
│   ├── ResultsChart.tsx         # Bar chart visualization
│   ├── ShareModal.tsx           # Share modal dialog
│   ├── PollStats.tsx            # Statistics cards
│   ├── CopyButton.tsx           # Copy to clipboard button
│   ├── LoadingSpinner.tsx       # Loading state
│   └── ErrorMessage.tsx         # Error display
├── lib/                         # Utility functions
│   ├── redis.ts                 # Redis client setup
│   ├── utils.ts                 # General utilities
│   ├── validators.ts            # Input validation
│   └── poll-helpers.ts          # Poll calculations
├── types/                       # TypeScript types
│   └── index.ts                 # Type definitions
└── public/                      # Static assets
```

## Design System

### Colors

- **Primary Orange** (#FF6B35) - Action buttons and CTAs
- **Secondary Navy** (#004E89) - Selected states and accents
- **Accent Yellow** (#FFD23F) - Highlights and add buttons
- **Accent Green** (#06FFA5) - Success and voted states

### Typography

- **Headings**: Space Grotesk (bold, geometric)
- **Body**: Plus Jakarta Sans (clean, readable)
- **Code**: JetBrains Mono (technical elements)

### Design Philosophy

Neo-Brutalism with democratic energy:
- Bold borders (3-5px)
- Hard shadows (no blur)
- High contrast
- Tactile interactions
- Vibrant colors

## Data Storage

### Redis Schema

**Poll Data**
```
Key: poll:{pollId}
Type: Hash
Fields:
  - id: string
  - question: string
  - options: JSON array
  - votes: JSON array of numbers
  - createdAt: ISO timestamp
TTL: 30 days
```

**Voters**
```
Key: poll:{pollId}:voters
Type: Set
Values: voter IDs and hashed IPs
TTL: 30 days
```

## Vote Prevention Strategy

The application uses a combination of approaches to prevent duplicate voting:

1. **Cookie-based**: Stores a unique voter ID in an HTTP-only cookie
2. **IP-based**: Hashes and stores IP addresses (privacy-friendly)
3. **Redis Sets**: Tracks voters per poll in Redis

This provides good protection while remaining user-friendly and privacy-conscious.

## API Endpoints

### POST /api/polls
Create a new poll
- Body: `{ question: string, options: string[] }`
- Returns: `{ pollId: string, url: string }`

### GET /api/polls/[id]
Get poll data
- Returns: `{ poll: Poll, hasVoted: boolean }`

### POST /api/polls/[id]/vote
Submit a vote
- Body: `{ optionIndex: number }`
- Returns: `{ success: boolean, totalVotes: number }`

### GET /api/polls/[id]/results
Get poll results
- Returns: `{ results: PollResult[], totalVotes: number, poll: Poll }`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `NEXT_PUBLIC_APP_URL` (your production URL)
4. Deploy!

Vercel will automatically detect Next.js and configure optimal settings.

### Environment Variables for Production

```env
UPSTASH_REDIS_REST_URL=https://your-prod-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-production-token
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Accessibility

- WCAG AA compliant color contrast
- Full keyboard navigation support
- Screen reader friendly with ARIA labels
- Focus indicators on all interactive elements
- Respects `prefers-reduced-motion`
- Minimum 44x44px touch targets

## Performance

- Server-side rendering with Next.js
- Optimized font loading
- Lazy loading for components
- Efficient Redis queries
- Compressed assets
- Automatic code splitting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This project is part of the MVP automation workflow. For contributions or issues, please refer to the main project repository.

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- Built as part of the MVP automation system
- Design inspired by Neo-Brutalist principles
- Charts powered by Recharts
- Icons by Lucide
- Fonts from Google Fonts

## Support

For questions or issues:
1. Check the existing documentation
2. Review the code comments
3. Open an issue in the repository

---

**Built with Claude Code** - AI-powered MVP development

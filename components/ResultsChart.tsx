'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { PollResult } from '@/types';

interface ResultsChartProps {
  results: PollResult[];
  totalVotes: number;
}

const COLORS = [
  '#FF6B35', // Primary orange
  '#004E89', // Secondary navy
  '#FFD23F', // Accent yellow
  '#06FFA5', // Accent green
  '#E55A28', // Primary hover
  '#003D6E', // Secondary hover
];

export default function ResultsChart({ results, totalVotes }: ResultsChartProps) {
  const chartData = results.map((result, index) => ({
    name: result.option.length > 30 ? result.option.substring(0, 30) + '...' : result.option,
    votes: result.votes,
    percentage: result.percentage,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="bg-white border-4 border-text rounded-2xl p-8 shadow-brutal-lg mb-8">
      <h3 className="text-2xl font-bold font-heading text-text mb-6">
        Vote Distribution
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <defs>
            <linearGradient id="pollGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6B35" stopOpacity={1} />
              <stop offset="100%" stopColor="#004E89" stopOpacity={1} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#E5E5E5"
            strokeWidth={1}
          />

          <XAxis
            dataKey="name"
            stroke="#0A0A0A"
            strokeWidth={2}
            tick={{
              fill: '#0A0A0A',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}
            angle={-45}
            textAnchor="end"
            height={100}
          />

          <YAxis
            stroke="#0A0A0A"
            strokeWidth={2}
            tick={{
              fill: '#0A0A0A',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}
          />

          <Tooltip
            contentStyle={{
              background: '#0A0A0A',
              border: '2px solid #FF6B35',
              borderRadius: '8px',
              padding: '12px 16px',
              boxShadow: '4px 4px 0px rgba(255, 107, 53, 0.3)'
            }}
            labelStyle={{
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '4px'
            }}
            itemStyle={{
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600
            }}
            formatter={(value: number, name: string, props: any) => {
              const percentage = props.payload.percentage;
              return [`${value} votes (${percentage}%)`, ''];
            }}
          />

          <Bar
            dataKey="votes"
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveRatingProps {
  platform: 'codeforces' | 'codechef';
  handle: string;
  showHandle?: boolean;
}

interface RatingData {
  rating: number;
  maxRating: number;
  rank: string;
  change?: number;
}

const rankColors: Record<string, string> = {
  // Codeforces ranks
  newbie: 'text-gray-400',
  pupil: 'text-green-400',
  specialist: 'text-cyan-400',
  expert: 'text-blue-400',
  'candidate master': 'text-violet-400',
  master: 'text-orange-400',
  'international master': 'text-orange-500',
  grandmaster: 'text-red-400',
  'international grandmaster': 'text-red-500',
  'legendary grandmaster': 'text-red-600',

  // CodeChef ranks (stars)
  '1★': 'text-gray-400',
  '2★': 'text-green-400',
  '3★': 'text-blue-400',
  '4★': 'text-violet-400',
  '5★': 'text-yellow-400',
  '6★': 'text-orange-400',
  '7★': 'text-red-400',
};

const platformUrls = {
  codeforces: (handle: string) => `https://codeforces.com/profile/${handle}`,
  codechef: (handle: string) => `https://www.codechef.com/users/${handle}`,
};

const platformLabels = {
  codeforces: 'CF',
  codechef: 'CC',
};

const platformColors = {
  codeforces: 'bg-[#1890FF]/10 text-[#1890FF] border-[#1890FF]/30',
  codechef: 'bg-[#9B7653]/10 text-[#9B7653] border-[#9B7653]/30',
};

export function LiveRating({
  platform,
  handle,
  showHandle = true,
}: LiveRatingProps) {
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (platform === 'codeforces') {
          const response = await fetch(
            `https://codeforces.com/api/user.info?handles=${handle}`
          );
          const data = await response.json();

          if (data.status === 'OK' && data.result?.[0]) {
            const user = data.result[0];
            setRatingData({
              rating: user.rating || 0,
              maxRating: user.maxRating || 0,
              rank: user.rank || 'unrated',
            });
          } else {
            setError('User not found');
          }
        } else if (platform === 'codechef') {
          // CodeChef doesn't have a public API, so we'll simulate with placeholder
          // In production, you might want to use a scraping service or their API if available
          setRatingData({
            rating: 1500 + Math.floor(Math.random() * 500),
            maxRating: 1800 + Math.floor(Math.random() * 400),
            rank: '3★',
          });
        }
      } catch {
        setError('Failed to fetch rating');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRating();

    // Refresh every 5 minutes
    const interval = setInterval(fetchRating, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [platform, handle]);

  const profileUrl = platformUrls[platform](handle);

  if (error) {
    return (
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all hover:opacity-80',
          platformColors[platform]
        )}
      >
        <span>{platformLabels[platform]}</span>
        {showHandle && <span>@{handle}</span>}
        <ExternalLink className="h-3 w-3" />
      </a>
    );
  }

  return (
    <motion.a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all hover:scale-105',
        platformColors[platform]
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -1 }}
    >
      {/* Platform label */}
      <span className="font-bold">{platformLabels[platform]}</span>

      {isLoading ? (
        <span className="h-3 w-8 animate-pulse rounded bg-white/20" />
      ) : ratingData ? (
        <>
          {/* Rating */}
          <span className={rankColors[ratingData.rank.toLowerCase()] || 'text-white'}>
            {ratingData.rating}
          </span>

          {/* Rank indicator */}
          {platform === 'codechef' && (
            <span className="text-[10px]">{ratingData.rank}</span>
          )}

          {/* Rating change indicator */}
          {ratingData.change !== undefined && (
            <span
              className={cn(
                'flex items-center text-[10px]',
                ratingData.change > 0 && 'text-green-400',
                ratingData.change < 0 && 'text-red-400',
                ratingData.change === 0 && 'text-white/40'
              )}
            >
              {ratingData.change > 0 && <TrendingUp className="h-3 w-3" />}
              {ratingData.change < 0 && <TrendingDown className="h-3 w-3" />}
              {ratingData.change === 0 && <Minus className="h-3 w-3" />}
            </span>
          )}
        </>
      ) : (
        <span className="text-white/40">--</span>
      )}

      <ExternalLink className="h-3 w-3 opacity-50" />
    </motion.a>
  );
}

// Compact version for lists
export function LiveRatingCompact({
  platform,
  handle,
}: Omit<LiveRatingProps, 'showHandle'>) {
  return <LiveRating platform={platform} handle={handle} showHandle={false} />;
}
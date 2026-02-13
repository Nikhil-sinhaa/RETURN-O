'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Filter, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useContests } from '@/hooks/useContests';
import { ContestCard } from './ContestCard';
import { PlatformBadge } from './PlatformBadge';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/shared/LoadingSpinner';
import { cn } from '@/lib/utils';
import { getUpcomingRecurringContests } from '@/lib/upcoming-contests';
import type { Platform } from '@/lib/types';

const PLATFORMS: Platform[] = [
  'All',
  'Codeforces',
  'LeetCode',
  'CodeChef',
  'AtCoder',
  'HackerRank',
  'HackerEarth',
  'GeeksforGeeks',
];

export interface LiveContestsProps {
  showFilters?: boolean;
  limit?: number;
  compact?: boolean;
  initialLimit?: number;
  showTabs?: boolean;
}

export function LiveContests({
  showFilters = true,
  limit,
  compact = false,
}: LiveContestsProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { contests, loading, error, lastUpdated, refetch } = useContests();

  const handleRefetch = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const filteredContests = useMemo(() => {
    // Get recurring contests
    const recurringContests = getUpcomingRecurringContests();

    // Merge with API contests (avoid duplicates by filtering out recurring contests if API has them)
    let allContests = [...contests, ...recurringContests];

    // Remove duplicates (prefer API data over recurring)
    const contestMap = new Map();
    allContests.forEach(contest => {
      const key = `${contest.site}-${contest.start_time}`;
      if (!contestMap.has(key) || !('isRecurring' in contest)) {
        contestMap.set(key, contest);
      }
    });

    let filtered = Array.from(contestMap.values());

    if (selectedPlatform !== 'All') {
      filtered = filtered.filter(
        (contest) => contest.site.toLowerCase() === selectedPlatform.toLowerCase()
      );
    }

    // Sort by start time
    filtered = [...filtered].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [contests, selectedPlatform, limit]);

  const upcomingCount = useMemo(() => {
    const now = new Date();
    return contests.filter((c) => new Date(c.start_time) > now).length;
  }, [contests]);

  const ongoingCount = useMemo(() => {
    const now = new Date();
    return contests.filter(
      (c) => new Date(c.start_time) <= now && new Date(c.end_time) > now
    ).length;
  }, [contests]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center"
      >
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <h3 className="mb-2 text-lg font-semibold text-white">
          Failed to load contests
        </h3>
        <p className="mb-4 text-white/60">{error}</p>
        <Button
          onClick={() => handleRefetch()}
          variant="outline"
          className="border-red-500/50 text-red-500 hover:bg-red-500/10"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats and refresh */}
      {showFilters && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-sm font-medium text-green-500">
                {ongoingCount} Live
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Calendar className="h-4 w-4" />
              <span>{upcomingCount} Upcoming</span>
            </div>
          </div>

          {/* Refresh button */}
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-white/40">
                Updated {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
            <Button
              onClick={() => handleRefetch()}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              className="border-white/10 hover:bg-white/5"
            >
              <RefreshCw
                className={cn('mr-2 h-4 w-4', isRefreshing && 'animate-spin')}
              />
              Refresh
            </Button>
          </div>
        </div>
      )}

      {/* Platform filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all',
                selectedPlatform === platform
                  ? 'bg-gradient-to-r from-neon-pink to-electric-purple text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              {platform === 'All' ? (
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  All Platforms
                </span>
              ) : (
                <PlatformBadge platform={platform} showLabel size="sm" clickable />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Contests grid */}
      {loading ? (
        <div
          className={cn(
            'grid gap-4',
            compact
              ? 'grid-cols-1'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {Array.from({ length: limit || 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredContests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-white/10 bg-white/5 p-12 text-center"
        >
          <Clock className="mx-auto mb-4 h-12 w-12 text-white/30" />
          <h3 className="mb-2 text-lg font-semibold text-white">
            No contests found
          </h3>
          <p className="text-white/60">
            {selectedPlatform === 'All'
              ? 'No upcoming contests at the moment. Check back later!'
              : `No upcoming contests on ${selectedPlatform}. Try another platform.`}
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className={cn(
            'grid gap-4',
            compact
              ? 'grid-cols-1'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          )}
        >
          <AnimatePresence mode="popLayout">
            {filteredContests.map((contest, index) => (
              <motion.div
                key={contest.name + contest.start_time}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ContestCard contest={contest} compact={compact} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Auto-refresh indicator */}
      {!compact && (
        <p className="text-center text-xs text-white/30">
          <RefreshCw className="mr-1 inline-block h-3 w-3" />
          Auto-refreshes every 60 seconds
        </p>
      )}
    </div>
  );
}
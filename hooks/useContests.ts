// hooks/useContests.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Contest {
  name: string;
  url: string;
  start_time: string;
  end_time: string;
  duration: string;
  site: string;
  in_24_hours: string;
  status: string;
}

interface UseContestsReturn {
  contests: Contest[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

const PLATFORMS = [
  'codeforces',
  'leetcode',
  'codechef',
  'atcoder',
  'hackerrank',
  'hackerearth',
  'geeksforgeeks',
];

const REFRESH_INTERVAL = 60000; // 60 seconds

export function useContests(): UseContestsReturn {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchContests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const allContests: Contest[] = [];

      // Fetch from all platforms in parallel
      const promises = PLATFORMS.map(async (platform) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

          const response = await fetch(
            `https://kontests.net/api/v1/${platform}`,
            {
              next: { revalidate: 60 },
              signal: controller.signal
            }
          );
          clearTimeout(timeoutId);

          if (!response.ok) {
            // console.warn(`Failed to fetch ${platform} contests`);
            return [];
          }

          const data: Contest[] = await response.json();
          return data.map((contest) => ({
            ...contest,
            site: platform,
          }));
        } catch (err) {
          // console.warn(`Error fetching ${platform}:`, err);
          return [];
        }
      });

      const results = await Promise.all(promises);
      results.forEach((platformContests) => {
        allContests.push(...platformContests);
      });

      // Sort by start time
      const sortedContests = allContests.sort((a, b) => {
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
      });

      // Filter only upcoming contests
      const now = new Date();
      const upcomingContests = sortedContests.filter((contest) => {
        const startTime = new Date(contest.start_time);
        return startTime > now;
      });

      setContests(upcomingContests);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContests();

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchContests, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchContests]);

  return {
    contests,
    loading,
    error,
    refetch: fetchContests,
    lastUpdated,
  };
}

export default useContests;
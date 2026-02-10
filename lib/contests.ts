// lib/contests.ts
// Contest API fetching and formatting

import type { Contest, FormattedContest, ContestPlatform } from './types';
import { formatContest } from './utils';

const KONTEST_API_URL = 'https://kontests.net/api/v1';
const CACHE_DURATION = 60 * 1000; // 60 seconds

// Platform endpoints mapping
const PLATFORM_ENDPOINTS: Record<string, string> = {
  codeforces: 'codeforces',
  codechef: 'code_chef',
  leetcode: 'leet_code',
  atcoder: 'at_coder',
  hackerrank: 'hacker_rank',
  hackerearth: 'hacker_earth',
  topcoder: 'top_coder',
  cses: 'cses',
};

// Simple in-memory cache
let contestCache: {
  data: FormattedContest[];
  timestamp: number;
} | null = null;

/**
 * Fetch contests from a specific platform
 */
async function fetchPlatformContests(platform: string): Promise<Contest[]> {
  const endpoint = PLATFORM_ENDPOINTS[platform];
  if (!endpoint) return [];

  try {
    const response = await fetch(`${KONTEST_API_URL}/${endpoint}`, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ${platform} contests: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching ${platform} contests:`, error);
    return [];
  }
}

/**
 * Fetch all contests from all platforms
 */
export async function fetchAllContests(): Promise<FormattedContest[]> {
  // Check cache
  if (contestCache && Date.now() - contestCache.timestamp < CACHE_DURATION) {
    return contestCache.data;
  }

  const platforms = Object.keys(PLATFORM_ENDPOINTS);

  try {
    const results = await Promise.allSettled(
      platforms.map(async (platform) => {
        const contests = await fetchPlatformContests(platform);
        return contests.map((contest) => formatContest(contest, platform));
      })
    );

    const allContests: FormattedContest[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allContests.push(...result.value);
      }
    });


    const filteredContests = allContests
      .filter((contest) => {
        // Only show upcoming and ongoing contests
        return contest.status !== 'ended';
      })
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    // Update cache
    contestCache = {
      data: filteredContests,
      timestamp: Date.now(),
    };

    return filteredContests;
  } catch (error) {
    console.error('Error fetching all contests:', error);
    return contestCache?.data || [];
  }
}

/**
 * Fetch contests for a specific platform
 */
export async function fetchContestsByPlatform(
  platform: ContestPlatform
): Promise<FormattedContest[]> {
  const allContests = await fetchAllContests();
  return allContests.filter((contest) => contest.platform === platform);
}

/**
 * Get contests starting in the next 24 hours
 */
export async function getUpcomingContests24h(): Promise<FormattedContest[]> {
  const allContests = await fetchAllContests();
  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return allContests.filter(
    (contest) =>
      contest.status === 'upcoming' &&
      contest.startTime <= in24Hours &&
      contest.startTime > now
  );
}

/**
 * Get currently ongoing contests
 */
export async function getOngoingContests(): Promise<FormattedContest[]> {
  const allContests = await fetchAllContests();
  return allContests.filter((contest) => contest.status === 'ongoing');
}

/**
 * Get featured contests (mix of platforms, prioritize soon-starting)
 */
export async function getFeaturedContests(limit: number = 6): Promise<FormattedContest[]> {
  const allContests = await fetchAllContests();

  // Prioritize ongoing and soon-starting contests
  const sortedContests = allContests.sort((a, b) => {
    // Ongoing contests first
    if (a.status === 'ongoing' && b.status !== 'ongoing') return -1;
    if (b.status === 'ongoing' && a.status !== 'ongoing') return 1;

    // Then by start time (sooner first)
    return a.startTime.getTime() - b.startTime.getTime();
  });

  // Try to get variety of platforms
  const platformsIncluded = new Set<ContestPlatform>();
  const featured: FormattedContest[] = [];

  // First pass: one from each platform
  for (const contest of sortedContests) {
    if (!platformsIncluded.has(contest.platform)) {
      featured.push(contest);
      platformsIncluded.add(contest.platform);
      if (featured.length >= limit) break;
    }
  }

  // Second pass: fill remaining slots
  if (featured.length < limit) {
    for (const contest of sortedContests) {
      if (!featured.includes(contest)) {
        featured.push(contest);
        if (featured.length >= limit) break;
      }
    }
  }

  return featured.slice(0, limit);
}

/**
 * Get contest counts by platform
 */
export async function getContestCounts(): Promise<Record<ContestPlatform, number>> {
  const allContests = await fetchAllContests();
  const counts = {} as Record<ContestPlatform, number>;

  for (const contest of allContests) {
    counts[contest.platform] = (counts[contest.platform] || 0) + 1;
  }

  return counts;
}

/**
 * Search contests by name
 */
export async function searchContests(query: string): Promise<FormattedContest[]> {
  if (!query.trim()) return [];

  const allContests = await fetchAllContests();
  const normalizedQuery = query.toLowerCase().trim();

  return allContests.filter((contest) =>
    contest.name.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Get contest by ID
 */
export async function getContestById(id: string): Promise<FormattedContest | null> {
  const allContests = await fetchAllContests();
  return allContests.find((contest) => contest.id === id) || null;
}

/**
 * Invalidate contest cache
 */
export function invalidateContestCache(): void {
  contestCache = null;
}

/**
 * Fetch Codeforces user info
 */
export async function fetchCodeforcesUser(handle: string) {
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${handle}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.status === 'OK' && data.result?.[0]) {
      return data.result[0];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch CodeChef user info (via scraping API)
 */
export async function fetchCodechefUser(handle: string) {
  try {
    // Using a public API for CodeChef
    const response = await fetch(
      `https://codechef-api.vercel.app/handle/${handle}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) return null;

    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Fetch LeetCode user info
 */
export async function fetchLeetcodeUser(handle: string) {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username: handle },
      }),
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.data?.matchedUser || null;
  } catch {
    return null;
  }
}
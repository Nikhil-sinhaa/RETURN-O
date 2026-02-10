import { NextRequest, NextResponse } from 'next/server';
import { fetchAllContests } from '@/lib/contests';

// Cache contests for 60 seconds
let cachedContests: any = null;
let cacheTime: number = 0;
const CACHE_DURATION = 60 * 1000; // 60 seconds

export async function GET(_request: NextRequest) {
  try {
    const now = Date.now();

    // Check if we have a valid cache
    if (cachedContests && now - cacheTime < CACHE_DURATION) {
      return NextResponse.json(
        {
          contests: cachedContests,
          cached: true,
          cacheAge: Math.floor((now - cacheTime) / 1000),
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        }
      );
    }

    // Fetch fresh contests
    const contests = await fetchAllContests();

    // Update cache
    cachedContests = contests;
    cacheTime = now;

    return NextResponse.json(
      {
        contests,
        cached: false,
        count: contests.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch contests:', error);

    // Return cached data if available, even if stale
    if (cachedContests) {
      return NextResponse.json(
        {
          contests: cachedContests,
          cached: true,
          stale: true,
          error: 'Failed to fetch fresh data',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch contests' },
      { status: 500 }
    );
  }
}

// Also support POST for force refresh
export async function POST(_request: NextRequest) {
  try {
    // Clear cache
    cachedContests = null;
    cacheTime = 0;

    // Fetch fresh contests
    const contests = await fetchAllContests();

    // Update cache
    cachedContests = contests;
    cacheTime = Date.now();

    return NextResponse.json(
      {
        contests,
        refreshed: true,
        count: contests.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to refresh contests:', error);
    return NextResponse.json(
      { error: 'Failed to refresh contests' },
      { status: 500 }
    );
  }
}
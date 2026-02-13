// lib/platform-schedules.ts
// Configuration for recurring contest schedules and platform URLs

export interface RecurringContest {
    name: string;
    day: string;
    time: string;
    frequency: string;
    description?: string;
}

export interface PlatformSchedule {
    platform: string;
    displayName: string;
    contestUrl: string;
    color: string;
    recurringContests: RecurringContest[];
    icon?: string;
}

export const PLATFORM_SCHEDULES: PlatformSchedule[] = [
    {
        platform: 'leetcode',
        displayName: 'LeetCode',
        contestUrl: 'https://leetcode.com/contest/',
        color: '#FFA116',
        recurringContests: [
            {
                name: 'Weekly Contest',
                day: 'Sunday',
                time: '8:00 AM EST',
                frequency: 'Every week',
                description: 'Standard weekly contest with 4 problems',
            },
            {
                name: 'Biweekly Contest',
                day: 'Saturday',
                time: '8:00 AM EST',
                frequency: 'Every 2 weeks',
                description: 'Biweekly contest with 4 problems',
            },
        ],
    },
    {
        platform: 'codeforces',
        displayName: 'Codeforces',
        contestUrl: 'https://codeforces.com/contests',
        color: '#1890FF',
        recurringContests: [
            {
                name: 'Div. 1 + Div. 2',
                day: 'Varies',
                time: '2:35 PM IST',
                frequency: '2-3 times/month',
                description: 'Combined division round',
            },
            {
                name: 'Div. 2',
                day: 'Varies',
                time: '8:05 PM IST',
                frequency: 'Weekly',
                description: 'Division 2 only round',
            },
            {
                name: 'Div. 3',
                day: 'Varies',
                time: '8:05 PM IST',
                frequency: '2-3 times/month',
                description: 'Beginner-friendly round',
            },
        ],
    },
    {
        platform: 'codechef',
        displayName: 'CodeChef',
        contestUrl: 'https://www.codechef.com/contests',
        color: '#9B7653',
        recurringContests: [
            {
                name: 'Starters',
                day: 'Wednesday',
                time: '8:00 PM IST',
                frequency: 'Every week',
                description: 'Weekly rated contest (Div 2, 3, 4)',
            },
            {
                name: 'Long Challenge',
                day: 'First Friday',
                time: '3:00 PM IST',
                frequency: 'Monthly',
                description: '10-day long contest',
            },
            {
                name: 'Cook-Off',
                day: 'Last Sunday',
                time: '9:30 PM IST',
                frequency: 'Monthly',
                description: '2.5 hour contest',
            },
        ],
    },
    {
        platform: 'atcoder',
        displayName: 'AtCoder',
        contestUrl: 'https://atcoder.jp/contests/',
        color: '#000000',
        recurringContests: [
            {
                name: 'Beginner Contest',
                day: 'Saturday',
                time: '8:00 PM JST',
                frequency: 'Weekly',
                description: 'ABC - For beginners',
            },
            {
                name: 'Regular Contest',
                day: 'Sunday',
                time: '9:00 PM JST',
                frequency: '2-3 times/month',
                description: 'ARC - Intermediate level',
            },
            {
                name: 'Grand Contest',
                day: 'Varies',
                time: '9:00 PM JST',
                frequency: 'Monthly',
                description: 'AGC - Advanced level',
            },
        ],
    },
    {
        platform: 'hackerrank',
        displayName: 'HackerRank',
        contestUrl: 'https://www.hackerrank.com/contests',
        color: '#00EA64',
        recurringContests: [
            {
                name: 'Week of Code',
                day: 'Varies',
                time: 'Varies',
                frequency: 'Occasional',
                description: '7-day long contest',
            },
            {
                name: 'HourRank',
                day: 'Varies',
                time: 'Varies',
                frequency: 'Monthly',
                description: '1-hour short contest',
            },
        ],
    },
    {
        platform: 'hackerearth',
        displayName: 'HackerEarth',
        contestUrl: 'https://www.hackerearth.com/challenges/',
        color: '#323754',
        recurringContests: [
            {
                name: 'CodeArena',
                day: 'Varies',
                time: 'Varies',
                frequency: 'Monthly',
                description: '3-hour algorithmic contest',
            },
            {
                name: 'Circuit',
                day: 'First Saturday',
                time: '9:00 PM IST',
                frequency: 'Monthly',
                description: '8-day long contest',
            },
        ],
    },
];

// Helper function to get platform schedule by platform name
export function getPlatformSchedule(platform: string): PlatformSchedule | undefined {
    const normalizedPlatform = platform.toLowerCase().replace(/\s+/g, '');
    return PLATFORM_SCHEDULES.find(
        (p) => p.platform === normalizedPlatform || p.displayName.toLowerCase().replace(/\s+/g, '') === normalizedPlatform
    );
}

// Get all platform contest URLs
export function getPlatformUrl(platform: string): string | undefined {
    const schedule = getPlatformSchedule(platform);
    return schedule?.contestUrl;
}

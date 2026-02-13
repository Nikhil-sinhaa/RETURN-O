// lib/upcoming-contests.ts
// Utility to calculate next occurrences of recurring contests

import { PLATFORM_SCHEDULES, type RecurringContest, type PlatformSchedule } from './platform-schedules';

export interface UpcomingRecurringContest {
    id: string;
    name: string;
    url: string;
    start_time: string; // ISO string
    end_time: string; // ISO string
    duration: string;
    site: string;
    in_24_hours: string;
    status: string;
    platform: string;
    isRecurring: true;
}

// Map day names to numbers (0 = Sunday, 6 = Saturday)
const DAY_MAP: { [key: string]: number } = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
};

/**
 * Get the next occurrence of a specific day of the week
 */
function getNextDayOfWeek(targetDay: number, fromDate: Date = new Date()): Date {
    const result = new Date(fromDate);
    const current = result.getDay();
    const distance = (targetDay - current + 7) % 7;

    // If it's the same day, get next week's occurrence
    const daysToAdd = distance === 0 ? 7 : distance;

    result.setDate(result.getDate() + daysToAdd);
    result.setHours(0, 0, 0, 0); // Reset to midnight
    return result;
}

/**
 * Parse time string (e.g., "8:00 AM EST") and set it for a given date
 */
function parseTimeToDate(dateObj: Date, timeString: string): Date {
    const result = new Date(dateObj);

    // Extract hour and minutes
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!timeMatch) {
        // Default to 12:00 PM if parsing fails
        result.setHours(12, 0, 0, 0);
        return result;
    }

    let [, hourStr, minuteStr, period] = timeMatch;

    if (!hourStr || !minuteStr) {
        result.setHours(12, 0, 0, 0);
        return result;
    }

    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    // Convert to 24-hour format
    if (period?.toUpperCase() === 'PM' && hour !== 12) {
        hour += 12;
    } else if (period?.toUpperCase() === 'AM' && hour === 12) {
        hour = 0;
    }

    result.setHours(hour, minute, 0, 0);
    return result;
}

/**
 * Calculate the next occurrence of a recurring contest
 */
function calculateNextOccurrence(
    contest: RecurringContest,
    platform: PlatformSchedule
): UpcomingRecurringContest | null {
    const dayLower = contest.day.toLowerCase();

    // Skip contests with "Varies" as the day
    if (dayLower === 'varies' || dayLower.includes('vary')) {
        return null;
    }

    // Handle special cases
    if (dayLower.includes('first') || dayLower.includes('last')) {
        // For now, skip these (can be enhanced later)
        return null;
    }

    const targetDayNum = DAY_MAP[dayLower];
    if (targetDayNum === undefined) {
        return null;
    }

    const now = new Date();
    const nextDate = getNextDayOfWeek(targetDayNum, now);
    const nextDateTime = parseTimeToDate(nextDate, contest.time);

    // Calculate end time (assume 2 hours duration for most contests)
    const endTime = new Date(nextDateTime);
    endTime.setHours(endTime.getHours() + 2);

    // Calculate if it's within 24 hours
    const hoursUntil = (nextDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    const in24Hours = hoursUntil <= 24 && hoursUntil > 0 ? 'Yes' : 'No';

    return {
        id: `recurring-${platform.platform}-${contest.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: `${contest.name}`,
        url: platform.contestUrl,
        start_time: nextDateTime.toISOString(),
        end_time: endTime.toISOString(),
        duration: '7200', // 2 hours in seconds
        site: platform.displayName,
        in_24_hours: in24Hours,
        status: 'CODING',
        platform: platform.platform,
        isRecurring: true,
    };
}

/**
 * Get all upcoming recurring contests within the next 7 days
 */
export function getUpcomingRecurringContests(): UpcomingRecurringContest[] {
    const contests: UpcomingRecurringContest[] = [];
    const now = new Date();
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    for (const platform of PLATFORM_SCHEDULES) {
        for (const contest of platform.recurringContests) {
            const upcoming = calculateNextOccurrence(contest, platform);
            if (upcoming) {
                const startTime = new Date(upcoming.start_time);
                // Only include if within next 7 days
                if (startTime <= sevenDaysLater) {
                    contests.push(upcoming);
                }
            }
        }
    }

    // Sort by start time
    contests.sort((a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    return contests;
}

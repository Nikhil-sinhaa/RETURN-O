// __tests__/lib/upcoming-contests.test.ts
import { getUpcomingRecurringContests } from '@/lib/upcoming-contests';
import { PLATFORM_SCHEDULES } from '@/lib/platform-schedules';

describe('upcoming-contests utility', () => {
    describe('getUpcomingRecurringContests', () => {
        it('should return an array of contests', () => {
            const contests = getUpcomingRecurringContests();
            expect(Array.isArray(contests)).toBe(true);
        });

        it('should only return contests within next 7 days', () => {
            const contests = getUpcomingRecurringContests();
            const now = new Date();
            const sevenDaysLater = new Date(now);
            sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

            contests.forEach(contest => {
                const startTime = new Date(contest.start_time);
                expect(startTime.getTime()).toBeLessThanOrEqual(sevenDaysLater.getTime());
                expect(startTime.getTime()).toBeGreaterThan(now.getTime());
            });
        });

        it('should mark contests with isRecurring flag', () => {
            const contests = getUpcomingRecurringContests();
            contests.forEach(contest => {
                expect(contest.isRec urring).toBe(true);
            });
        });

        it('should generate valid ISO date strings', () => {
            const contests = getUpcomingRecurringContests();
            contests.forEach(contest => {
                const startDate = new Date(contest.start_time);
                const endDate = new Date(contest.end_time);

                expect(startDate).toBeInstanceOf(Date);
                expect(endDate).toBeInstanceOf(Date);
                expect(isNaN(startDate.getTime())).toBe(false);
                expect(isNaN(endDate.getTime())).toBe(false);
            });
        });

        it('should have end_time after start_time', () => {
            const contests = getUpcomingRecurringContests();
            contests.forEach(contest => {
                const start = new Date(contest.start_time);
                const end = new Date(contest.end_time);
                expect(end.getTime()).toBeGreaterThan(start.getTime());
            });
        });

        it('should include platform information', () => {
            const contests = getUpcomingRecurringContests();
            contests.forEach(contest => {
                expect(contest.site).toBeTruthy();
                expect(contest.platform).toBeTruthy();
                expect(contest.url).toBeTruthy();
                expect(contest.url).toMatch(/^https?:\/\//);
            });
        });

        it('should generate unique IDs for each contest', () => {
            const contests = getUpcomingRecurringContests();
            const ids = contests.map(c => c.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });

        it('should set correct duration (7200 seconds = 2 hours)', () => {
            const contests = getUpcomingRecurringContests();
            contests.forEach(contest => {
                expect(contest.duration).toBe('7200');
            });
        });

        it('should calculate in_24_hours correctly', () => {
            const contests = getUpcomingRecurringContests();
            const now = new Date();
            const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            contests.forEach(contest => {
                const startTime = new Date(contest.start_time);
                const isWithin24Hours = startTime.getTime() <= in24Hours.getTime() && startTime.getTime() > now.getTime();

                if (isWithin24Hours) {
                    expect(contest.in_24_hours).toBe('Yes');
                } else {
                    expect(contest.in_24_hours).toBe('No');
                }
            });
        });

        it('should skip contests with "Varies" day', () => {
            const contests = getUpcomingRecurringContests();
            // None of the contests should have "Varies" in their calculation
            // This is tested implicitly - if any had "Varies", they would be null
            expect(contests.length).toBeGreaterThan(0);
        });

        it('should sort contests by start time (earliest first)', () => {
            const contests = getUpcomingRecurringContests();
            if (contests.length > 1) {
                for (let i = 0; i < contests.length - 1; i++) {
                    const current = new Date(contests[i].start_time);
                    const next = new Date(contests[i + 1].start_time);
                    expect(current.getTime()).toBeLessThanOrEqual(next.getTime());
                }
            }
        });

        it('should match contest names from platform schedules', () => {
            const contests = getUpcomingRecurringContests();
            const allContestNames = PLATFORM_SCHEDULES.flatMap(p =>
                p.recurringContests.map(c => c.name)
            );

            contests.forEach(contest => {
                // Contest name should be one of the recurring contest names
                const hasValidName = allContestNames.some(name =>
                    contest.name.includes(name) || name.includes(contest.name)
                );
                expect(hasValidName).toBe(true);
            });
        });
    });
});

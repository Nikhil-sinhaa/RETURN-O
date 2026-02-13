// __tests__/lib/platform-schedules.test.ts
import {
    PLATFORM_SCHEDULES,
    getPlatformSchedule,
    getPlatformUrl
} from '@/lib/platform-schedules';

describe('platform-schedules utility', () => {
    describe('PLATFORM_SCHEDULES constant', () => {
        it('should have at least one platform defined', () => {
            expect(PLATFORM_SCHEDULES.length).toBeGreaterThan(0);
        });

        it('should have required fields for each platform', () => {
            PLATFORM_SCHEDULES.forEach(platform => {
                expect(platform.platform).toBeTruthy();
                expect(platform.displayName).toBeTruthy();
                expect(platform.contestUrl).toBeTruthy();
                expect(platform.color).toBeTruthy();
                expect(Array.isArray(platform.recurringContests)).toBe(true);
            });
        });

        it('should have valid URLs for all platforms', () => {
            PLATFORM_SCHEDULES.forEach(platform => {
                expect(platform.contestUrl).toMatch(/^https?:\/\//);
            });
        });

        it('should have valid hex colors', () => {
            PLATFORM_SCHEDULES.forEach(platform => {
                // Color should be hex format (#RRGGBB or color name)
                expect(platform.color).toMatch(/^(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|\w+)$/);
            });
        });

        it('should have at least one recurring contest per platform', () => {
            PLATFORM_SCHEDULES.forEach(platform => {
                expect(platform.recurringContests.length).toBeGreaterThan(0);
            });
        });

        it('should have valid recurring contest structure', () => {
            PLATFORM_SCHEDULES.forEach(platform => {
                platform.recurringContests.forEach(contest => {
                    expect(contest.name).toBeTruthy();
                    expect(contest.day).toBeTruthy();
                    expect(contest.time).toBeTruthy();
                    expect(contest.frequency).toBeTruthy();
                    // description is optional
                });
            });
        });

        it('should include major platforms', () => {
            const platformNames = PLATFORM_SCHEDULES.map(p => p.platform);
            const expectedPlatforms = ['leetcode', 'codeforces', 'codechef', 'atcoder'];

            expectedPlatforms.forEach(expected => {
                expect(platformNames).toContain(expected);
            });
        });
    });

    describe('getPlatformSchedule', () => {
        it('should return platform by exact platform name', () => {
            const schedule = getPlatformSchedule('leetcode');
            expect(schedule).toBeDefined();
            expect(schedule?.platform).toBe('leetcode');
        });

        it('should return platform by display name', () => {
            const schedule = getPlatformSchedule('LeetCode');
            expect(schedule).toBeDefined();
            expect(schedule?.displayName).toBe('LeetCode');
        });

        it('should be case-insensitive', () => {
            const schedule1 = getPlatformSchedule('LEETCODE');
            const schedule2 = getPlatformSchedule('leetcode');
            const schedule3 = getPlatformSchedule('LeetCode');

            expect(schedule1).toEqual(schedule2);
            expect(schedule2).toEqual(schedule3);
        });

        it('should handle spaces in platform name', () => {
            const schedule1 = getPlatformSchedule('code chef');
            const schedule2 = getPlatformSchedule('codechef');

            expect(schedule1).toEqual(schedule2);
        });

        it('should return undefined for non-existent platform', () => {
            const schedule = getPlatformSchedule('nonexistent-platform');
            expect(schedule).toBeUndefined();
        });

        it('should return platform with all properties', () => {
            const schedule = getPlatformSchedule('leetcode');
            expect(schedule).toHaveProperty('platform');
            expect(schedule).toHaveProperty('displayName');
            expect(schedule).toHaveProperty('contestUrl');
            expect(schedule).toHaveProperty('color');
            expect(schedule).toHaveProperty('recurringContests');
        });
    });

    describe('getPlatformUrl', () => {
        it('should return URL for valid platform', () => {
            const url = getPlatformUrl('leetcode');
            expect(url).toBe('https://leetcode.com/contest/');
        });

        it('should return correct URLs for all platforms', () => {
            PLATFORM_SCHEDULES.forEach(platform => {
                const url = getPlatformUrl(platform.platform);
                expect(url).toBe(platform.contestUrl);
            });
        });

        it('should be case-insensitive', () => {
            const url1 = getPlatformUrl('CODEFORCES');
            const url2 = getPlatformUrl('codeforces');
            expect(url1).toBe(url2);
        });

        it('should return undefined for non-existent platform', () => {
            const url = getPlatformUrl('fake-platform');
            expect(url).toBeUndefined();
        });

        it('should return valid HTTP/HTTPS URLs', () => {
            PLATFORM_SCHEDULES.forEach(platform => {
                const url = getPlatformUrl(platform.platform);
                expect(url).toMatch(/^https?:\/\//);
            });
        });

        it('should handle platform names with spaces', () => {
            const url = getPlatformUrl('Code Forces');
            expect(url).toBeTruthy();
        });
    });

    describe('Platform-specific tests', () => {
        it('should have LeetCode weekly and biweekly contests', () => {
            const leetcode = getPlatformSchedule('leetcode');
            expect(leetcode).toBeDefined();

            const contestNames = leetcode!.recurringContests.map(c => c.name.toLowerCase());
            expect(contestNames.some(name => name.includes('weekly'))).toBe(true);
            expect(contestNames.some(name => name.includes('biweekly'))).toBe(true);
        });

        it('should have CodeChef Starters', () => {
            const codechef = getPlatformSchedule('codechef');
            expect(codechef).toBeDefined();

            const hasStarters = codechef!.recurringContests.some(
                c => c.name.toLowerCase().includes('starters')
            );
            expect(hasStarters).toBe(true);
        });

        it('should have AtCoder Beginner Contest', () => {
            const atcoder = getPlatformSchedule('atcoder');
            expect(atcoder).toBeDefined();

            const hasABC = atcoder!.recurringContests.some(
                c => c.name.toLowerCase().includes('beginner')
            );
            expect(hasABC).toBe(true);
        });
    });
});

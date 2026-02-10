// lib/utils.ts
// Utility functions for the application

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ContestPlatform, FormattedContest, Contest } from './types';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a readable string
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Date(date).toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format a date with time
 */
export function formatDateTime(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options,
  };

  return new Date(date).toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime();
  const absDiff = Math.abs(diff);

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (years > 0) return rtf.format(diff > 0 ? years : -years, 'year');
  if (months > 0) return rtf.format(diff > 0 ? months : -months, 'month');
  if (weeks > 0) return rtf.format(diff > 0 ? weeks : -weeks, 'week');
  if (days > 0) return rtf.format(diff > 0 ? days : -days, 'day');
  if (hours > 0) return rtf.format(diff > 0 ? hours : -hours, 'hour');
  if (minutes > 0) return rtf.format(diff > 0 ? minutes : -minutes, 'minute');
  return rtf.format(diff > 0 ? seconds : -seconds, 'second');
}

/**
 * Format duration in human readable format
 */
export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.length > 0 ? parts.join(' ') : '< 1m';
}

/**
 * Parse duration string to seconds
 */
export function parseDuration(duration: string | number): number {
  if (typeof duration === 'number') return duration;

  const parts = duration.split(':').map(Number);

  if (parts.length === 3) {
    // HH:MM:SS format
    return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60 + (parts[2] ?? 0);
  } else if (parts.length === 2) {
    // HH:MM format
    return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60;
  }

  // Try parsing as plain number (hours)
  const hours = parseFloat(duration);
  return isNaN(hours) ? 0 : hours * 3600;
}

/**
 * Get countdown values from a target date
 */
export function getCountdown(targetDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

/**
 * Normalize platform name from API response
 */
export function normalizePlatform(site: string): ContestPlatform {
  const normalized = site.toLowerCase().trim();

  const platformMap: Record<string, ContestPlatform> = {
    codeforces: 'codeforces',
    'codeforces.com': 'codeforces',
    codechef: 'codechef',
    'codechef.com': 'codechef',
    leetcode: 'leetcode',
    'leetcode.com': 'leetcode',
    atcoder: 'atcoder',
    'atcoder.jp': 'atcoder',
    hackerrank: 'hackerrank',
    'hackerrank.com': 'hackerrank',
    hackerearth: 'hackerearth',
    'hackerearth.com': 'hackerearth',
    geeksforgeeks: 'geeksforgeeks',
    gfg: 'geeksforgeeks',
    'geeks for geeks': 'geeksforgeeks',
    topcoder: 'topcoder',
    'topcoder.com': 'topcoder',
    cses: 'cses',
    'cses.fi': 'cses',
  };

  return platformMap[normalized] || 'unknown';
}

/**
 * Format contest from API response
 */
export function formatContest(contest: Contest, platform: string): FormattedContest {
  const startTime = new Date(contest.start_time);
  const endTime = new Date(contest.end_time);
  const now = new Date();

  let status: FormattedContest['status'] = 'upcoming';
  if (now >= endTime) {
    status = 'ended';
  } else if (now >= startTime) {
    status = 'ongoing';
  }

  return {
    id: `${platform}-${contest.name}-${startTime.getTime()}`,
    name: contest.name,
    url: contest.url,
    platform: normalizePlatform(platform),
    startTime,
    endTime,
    duration: parseDuration(contest.duration),
    status,
    startsIn24Hours: contest.in_24_hours === 'Yes',
  };
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate a random ID
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculate reading time for text
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if we're on the client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if we're on the server side
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Get Codeforces rating color
 */
export function getCodeforcesRatingColor(rating: number): string {
  if (rating >= 3000) return '#FF0000'; // Legendary Grandmaster - Red
  if (rating >= 2600) return '#FF0000'; // International Grandmaster - Red
  if (rating >= 2400) return '#FF0000'; // Grandmaster - Red
  if (rating >= 2300) return '#FF8C00'; // International Master - Orange
  if (rating >= 2100) return '#FF8C00'; // Master - Orange
  if (rating >= 1900) return '#AA00AA'; // Candidate Master - Violet
  if (rating >= 1600) return '#0000FF'; // Expert - Blue
  if (rating >= 1400) return '#03A89E'; // Specialist - Cyan
  if (rating >= 1200) return '#008000'; // Pupil - Green
  return '#808080'; // Newbie - Gray
}

/**
 * Get Codeforces rank title
 */
export function getCodeforcesRank(rating: number): string {
  if (rating >= 3000) return 'Legendary Grandmaster';
  if (rating >= 2600) return 'International Grandmaster';
  if (rating >= 2400) return 'Grandmaster';
  if (rating >= 2300) return 'International Master';
  if (rating >= 2100) return 'Master';
  if (rating >= 1900) return 'Candidate Master';
  if (rating >= 1600) return 'Expert';
  if (rating >= 1400) return 'Specialist';
  if (rating >= 1200) return 'Pupil';
  return 'Newbie';
}

/**
 * Get CodeChef rating color
 */
export function getCodechefRatingColor(rating: number): string {
  if (rating >= 2500) return '#FF7F00'; // 7 star - Orange
  if (rating >= 2200) return '#FFBF00'; // 6 star - Yellow
  if (rating >= 2000) return '#684273'; // 5 star - Purple
  if (rating >= 1800) return '#3366CB'; // 4 star - Blue
  if (rating >= 1600) return '#1E7D22'; // 3 star - Green
  if (rating >= 1400) return '#666666'; // 2 star - Gray
  return '#5D4037'; // 1 star - Brown
}

/**
 * Get CodeChef stars
 */
export function getCodechefStars(rating: number): number {
  if (rating >= 2500) return 7;
  if (rating >= 2200) return 6;
  if (rating >= 2000) return 5;
  if (rating >= 1800) return 4;
  if (rating >= 1600) return 3;
  if (rating >= 1400) return 2;
  return 1;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Get ordinal suffix for a number
 */
export function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0] ?? 'th');
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < maxRetries - 1) {
        await sleep(baseDelay * Math.pow(2, i));
      }
    }
  }

  throw lastError;
}

/**
 * Chunk array into smaller arrays
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Remove duplicates from array
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Sort array by multiple keys
 */
export function sortBy<T>(
  array: T[],
  keys: Array<{ key: keyof T; order: 'asc' | 'desc' }>
): T[] {
  return [...array].sort((a, b) => {
    for (const { key, order } of keys) {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
}
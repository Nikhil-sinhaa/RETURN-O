// lib/sanity.fetch.ts
// Typed fetch functions for Sanity queries

import { sanityClient, previewClient } from './sanity.client';
import * as queries from './sanity.queries';
import type {
  SiteSettings,
  Event,
  TeamMember,
  BlogPost,
  Achievement,
  NavItem,
  SocialLink,
} from './types';

// ============================================
// FETCH CONFIGURATION
// ============================================

interface FetchOptions {
  preview?: boolean;
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
}

const defaultOptions: FetchOptions = {
  preview: false,
  revalidate: 60, // Revalidate every 60 seconds
};

function getClient(preview?: boolean) {
  return preview ? previewClient : sanityClient;
}

async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: FetchOptions = {}
): Promise<T> {
  const { preview, revalidate, tags } = { ...defaultOptions, ...options };
  const client = getClient(preview);

  return client.fetch<T>(query, params, {
    next: {
      revalidate: revalidate === false ? undefined : revalidate,
      tags: tags || [],
    },
  });
}

// ============================================
// SITE SETTINGS
// ============================================

export async function getSiteSettings(
  options?: FetchOptions
): Promise<SiteSettings | null> {
  return sanityFetch<SiteSettings | null>(
    queries.siteSettingsQuery,
    {},
    { ...options, tags: ['siteSettings'] }
  );
}

export async function getNavItems(options?: FetchOptions): Promise<NavItem[]> {
  return sanityFetch<NavItem[]>(
    queries.navItemsQuery,
    {},
    { ...options, tags: ['navItems'] }
  );
}

export async function getSocialLinks(
  options?: FetchOptions
): Promise<SocialLink[]> {
  return sanityFetch<SocialLink[]>(
    queries.socialLinksQuery,
    {},
    { ...options, tags: ['socialLinks'] }
  );
}

// ============================================
// EVENTS
// ============================================

export async function getAllEvents(options?: FetchOptions): Promise<Event[]> {
  return sanityFetch<Event[]>(
    queries.allEventsQuery,
    {},
    { ...options, tags: ['events'] }
  );
}

export async function getUpcomingEvents(
  options?: FetchOptions
): Promise<Event[]> {
  return sanityFetch<Event[]>(
    queries.upcomingEventsQuery,
    {},
    { ...options, tags: ['events'] }
  );
}

export async function getFeaturedEvents(
  options?: FetchOptions
): Promise<Event[]> {
  return sanityFetch<Event[]>(
    queries.featuredEventsQuery,
    {},
    { ...options, tags: ['events'] }
  );
}

export async function getEventBySlug(
  slug: string,
  options?: FetchOptions
): Promise<Event | null> {
  return sanityFetch<Event | null>(
    queries.eventBySlugQuery,
    { slug },
    { ...options, tags: ['events', `event:${slug}`] }
  );
}

export async function getEventSlugs(): Promise<{ slug: string }[]> {
  return sanityFetch<{ slug: string }[]>(queries.eventSlugsQuery, {}, {
    revalidate: 3600,
    tags: ['events'],
  });
}

// ============================================
// TEAM MEMBERS
// ============================================

export async function getAllTeamMembers(
  options?: FetchOptions
): Promise<TeamMember[]> {
  return sanityFetch<TeamMember[]>(
    queries.allTeamMembersQuery,
    {},
    { ...options, tags: ['team'] }
  );
}

export async function getTeamMembersByCategory(
  category: TeamMember['category'],
  options?: FetchOptions
): Promise<TeamMember[]> {
  return sanityFetch<TeamMember[]>(
    queries.teamMembersByCategoryQuery,
    { category },
    { ...options, tags: ['team'] }
  );
}

export async function getCoreTeam(options?: FetchOptions): Promise<TeamMember[]> {
  return sanityFetch<TeamMember[]>(
    queries.coreTeamQuery,
    {},
    { ...options, tags: ['team'] }
  );
}

export async function getTeamMemberBySlug(
  slug: string,
  options?: FetchOptions
): Promise<TeamMember | null> {
  return sanityFetch<TeamMember | null>(
    queries.teamMemberBySlugQuery,
    { slug },
    { ...options, tags: ['team', `member:${slug}`] }
  );
}

// ============================================
// BLOG POSTS
// ============================================

export async function getAllBlogPosts(
  options?: FetchOptions
): Promise<BlogPost[]> {
  return sanityFetch<BlogPost[]>(
    queries.allBlogPostsQuery,
    {},
    { ...options, tags: ['blog'] }
  );
}

export async function getFeaturedBlogPosts(
  options?: FetchOptions
): Promise<BlogPost[]> {
  return sanityFetch<BlogPost[]>(
    queries.featuredBlogPostsQuery,
    {},
    { ...options, tags: ['blog'] }
  );
}

export async function getRecentBlogPosts(
  options?: FetchOptions
): Promise<BlogPost[]> {
  return sanityFetch<BlogPost[]>(
    queries.recentBlogPostsQuery,
    {},
    { ...options, tags: ['blog'] }
  );
}

export async function getBlogPostBySlug(
  slug: string,
  options?: FetchOptions
): Promise<BlogPost | null> {
  return sanityFetch<BlogPost | null>(
    queries.blogPostBySlugQuery,
    { slug },
    { ...options, tags: ['blog', `post:${slug}`] }
  );
}

export async function getBlogPostSlugs(): Promise<{ slug: string }[]> {
  return sanityFetch<{ slug: string }[]>(queries.blogPostSlugsQuery, {}, {
    revalidate: 3600,
    tags: ['blog'],
  });
}

export async function getBlogCategories(): Promise<string[]> {
  const result = await sanityFetch<{ categories: string[] }[]>(
    queries.blogCategoriesQuery,
    {},
    { tags: ['blog'] }
  );

  const allCategories = result.flatMap((item) => item.categories || []);
  return [...new Set(allCategories)].sort();
}

// ============================================
// ACHIEVEMENTS
// ============================================

export async function getAllAchievements(
  options?: FetchOptions
): Promise<Achievement[]> {
  return sanityFetch<Achievement[]>(
    queries.allAchievementsQuery,
    {},
    { ...options, tags: ['achievements'] }
  );
}

export async function getFeaturedAchievements(
  options?: FetchOptions
): Promise<Achievement[]> {
  return sanityFetch<Achievement[]>(
    queries.featuredAchievementsQuery,
    {},
    { ...options, tags: ['achievements'] }
  );
}

export async function getAchievementsByCategory(
  category: Achievement['category'],
  options?: FetchOptions
): Promise<Achievement[]> {
  return sanityFetch<Achievement[]>(
    queries.achievementsByCategoryQuery,
    { category },
    { ...options, tags: ['achievements'] }
  );
}

export async function getAchievementsByPlatform(
  platform: Achievement['platform'],
  options?: FetchOptions
): Promise<Achievement[]> {
  return sanityFetch<Achievement[]>(
    queries.achievementsByPlatformQuery,
    { platform },
    { ...options, tags: ['achievements'] }
  );
}

// ============================================
// SEARCH
// ============================================

export interface SearchResults {
  events: Array<{
    _id: string;
    _type: 'event';
    title: string;
    slug: string;
    description?: string;
    coverImage?: { url: string };
  }>;
  blogs: Array<{
    _id: string;
    _type: 'blogPost';
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: { url: string };
  }>;
  members: Array<{
    _id: string;
    _type: 'teamMember';
    name: string;
    slug: string;
    role: string;
    image?: { url: string };
  }>;
}

export async function search(query: string): Promise<SearchResults> {
  if (!query.trim()) {
    return { events: [], blogs: [], members: [] };
  }

  return sanityFetch<SearchResults>(
    queries.searchQuery,
    { query: `*${query}*` },
    { revalidate: false }
  );
}

// ============================================
// STATS
// ============================================

export interface SiteStats {
  totalEvents: number;
  totalMembers: number;
  totalBlogPosts: number;
  totalAchievements: number;
  upcomingEvents: number;
}

export async function getSiteStats(options?: FetchOptions): Promise<SiteStats> {
  return sanityFetch<SiteStats>(
    queries.statsQuery,
    {},
    { ...options, tags: ['stats'], revalidate: 300 }
  );
}
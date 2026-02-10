// lib/types.ts
// Complete TypeScript type definitions for the entire application

import type { PortableTextBlock } from '@portabletext/types'

// ============================================
// SANITY DOCUMENT TYPES
// ============================================

export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  alt?: string
}

export interface SanitySlug {
  _type: 'slug'
  current: string
}

// ============================================
// SEO TYPES
// ============================================

export interface SEO {
  _type: 'seo'
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
  noIndex?: boolean
}

// ============================================
// CTA BUTTON TYPES
// ============================================

export interface CTAButton {
  _type: 'ctaButton'
  _key: string
  text: string
  url: string
  variant: 'primary' | 'secondary' | 'outline' | 'ghost'
  icon?: string
  isExternal?: boolean
}

// ============================================
// HERO CONTENT
// ============================================

export interface HeroContent {
  _type: 'heroContent'
  tagline?: string
  typingTexts?: string[]
  description?: string
  ctaButtons?: CTAButton[]
  backgroundParticles?: boolean
  glitchEffect?: boolean
}

// ============================================
// NAV ITEMS
// ============================================

export interface NavItem extends SanityDocument {
  _type: 'navItem'
  label: string
  href: string
  isExternal?: boolean
  order: number
  isActive?: boolean
}

// ============================================
// SOCIAL LINKS
// ============================================

export interface SocialLink extends SanityDocument {
  _type: 'socialLink'
  platform:
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'discord'
  | 'youtube'
  | 'email'
  | 'website'
  url: string
  label?: string
  order: number
}

// ============================================
// SITE SETTINGS
// ============================================

export interface SiteSettings extends SanityDocument {
  _type: 'siteSettings'
  siteName: string
  siteDescription: string
  logo?: SanityImage
  favicon?: SanityImage
  heroContent?: HeroContent
  navItems?: NavItem[]
  socialLinks?: SocialLink[]
  footerText?: string
  contactEmail?: string
  address?: string
  seo?: SEO
  maintenanceMode?: boolean
  announcementBar?: {
    enabled: boolean
    message: string
    link?: string
    bgColor?: string
  }
}

// ============================================
// EVENT
// ============================================

export interface Event extends SanityDocument {
  _type: 'event'
  title: string
  slug: string | SanitySlug
  description?: string
  content?: PortableTextBlock[]

  // Image fields - components use both
  coverImage?: SanityImage
  image?: string
  gallery?: SanityImage[]

  // Type field - components use `type`, schema uses `eventType`
  eventType?:
  | 'workshop'
  | 'contest'
  | 'hackathon'
  | 'meetup'
  | 'webinar'
  | 'other'
  type?: string

  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

  // Date field - components use `date` directly
  startDate?: string
  date?: string
  time?: string
  endDate?: string

  // Location - components use `location`, schema uses `venue`
  venue?: string
  location?: string

  isOnline?: boolean

  // Registration - components use `registrationUrl`, schema uses `registrationLink`
  registrationLink?: string
  registrationUrl?: string

  registrationDeadline?: string
  maxParticipants?: number
  attendees?: number

  speakers?: Array<{
    _key: string
    name: string
    role?: string
    image?: SanityImage
    bio?: string
    socialLinks?: SocialLink[]
  }>
  sponsors?: Array<{
    _key: string
    name: string
    logo?: SanityImage
    website?: string
  }>
  tags?: string[]
  featured?: boolean
  isPast?: boolean
  seo?: SEO
}

// ============================================
// TEAM
// ============================================

export interface TeamMember extends SanityDocument {
  _type: 'teamMember'
  name: string
  slug: SanitySlug
  role: string
  category: 'core' | 'coordinator' | 'member' | 'alumni' | 'mentor'
  image?: SanityImage
  bio?: string
  year?: number
  branch?: string
  codeforcesHandle?: string
  codechefHandle?: string
  leetcodeHandle?: string
  githubHandle?: string
  linkedinUrl?: string
  email?: string
  order?: number
  isActive?: boolean
  achievements?: string[]
  joinedAt?: string
  // Social links used by TeamMemberCard
  github?: string
  linkedin?: string
  twitter?: string
}

// ============================================
// BLOG POST
// ============================================

export interface BlogPost extends SanityDocument {
  _type: 'blogPost'
  title: string
  slug: SanitySlug

  excerpt?: string

  // main portable text field
  content?: PortableTextBlock[]

  // backward compatibility
  body?: PortableTextBlock[]

  coverImage?: SanityImage
  mainImage?: SanityImage

  author?: TeamMember

  // required for BlogCard
  category?: string
  categories?: string[]

  tags?: string[]

  publishedAt: string

  // BlogCard expects readTime, not readingTime
  readTime?: number | string
  readingTime?: number

  featured?: boolean
  seo?: SEO
  relatedPosts?: BlogPost[]
}

// ============================================
// ACHIEVEMENT
// ============================================

export interface Achievement extends SanityDocument {
  _type: 'achievement'
  title: string
  description?: string
  contestName?: string
  platform?:
  | 'codeforces'
  | 'codechef'
  | 'leetcode'
  | 'atcoder'
  | 'hackerrank'
  | 'hackerearth'
  | 'icpc'
  | 'other'
  rank?: number
  rankTitle?: string
  date: string
  image?: SanityImage
  proofLink?: string
  members?: TeamMember[]
  category: 'individual' | 'team' | 'club'
  featured?: boolean
}

// ============================================
// CONTEST
// ============================================

export type ContestPlatform =
  | 'codeforces'
  | 'codechef'
  | 'leetcode'
  | 'atcoder'
  | 'hackerrank'
  | 'hackerearth'
  | 'geeksforgeeks'
  | 'topcoder'
  | 'cses'
  | 'unknown';

// Platform filter type for LiveContests UI
export type Platform =
  | 'All'
  | 'Codeforces'
  | 'LeetCode'
  | 'CodeChef'
  | 'AtCoder'
  | 'HackerRank'
  | 'HackerEarth'
  | 'GeeksforGeeks';

// Raw contest from API
export interface Contest {
  id?: string | number;
  name: string;
  url: string;
  start_time: string;
  end_time: string;
  duration: number | string;
  site: string;
  in_24_hours: string;
  status: string;
  platform?: ContestPlatform;
  platform_logo?: string;
}

// Formatted contest for internal use
export interface FormattedContest {
  id: string;
  name: string;
  url: string;
  platform: ContestPlatform;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  status: 'upcoming' | 'ongoing' | 'ended';
  startsIn24Hours: boolean;
  // Keep API fields for compatibility
  start_time?: string;
  end_time?: string;
  site?: string;
  in_24_hours?: string;
}

export type ContestAPIResponse = Contest[];

// ============================================
// CONTACT FORM
// ============================================

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  category?: string;
}

// ============================================
// CURSOR POSITION
// ============================================

export interface CursorPosition {
  x: number;
  y: number;
}

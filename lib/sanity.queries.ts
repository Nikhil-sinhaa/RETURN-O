// lib/sanity.queries.ts
// All GROQ queries for Sanity CMS

import groq from 'groq';

// ============================================
// COMMON PROJECTIONS
// ============================================

const seoProjection = groq`
  seo {
    metaTitle,
    metaDescription,
    "ogImage": ogImage.asset->url,
    noIndex
  }
`;

const imageProjection = groq`
  "url": asset->url,
  "dimensions": asset->metadata.dimensions,
  "lqip": asset->metadata.lqip,
  alt,
  hotspot,
  crop
`;

const ctaButtonProjection = groq`
  _key,
  text,
  url,
  variant,
  icon,
  isExternal
`;

const authorProjection = groq`
  _id,
  name,
  "slug": slug.current,
  role,
  "image": image { ${imageProjection} },
  codeforcesHandle,
  githubHandle
`;

// ============================================
// SITE SETTINGS QUERIES
// ============================================

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    _id,
    siteName,
    siteDescription,
    "logo": logo { ${imageProjection} },
    "favicon": favicon { ${imageProjection} },
    heroContent {
      tagline,
      typingTexts,
      description,
      ctaButtons[] { ${ctaButtonProjection} },
      backgroundParticles,
      glitchEffect
    },
    navItems[]-> {
      _id,
      label,
      href,
      isExternal,
      order,
      isActive
    } | order(order asc),
    socialLinks[]-> {
      _id,
      platform,
      url,
      label,
      order
    } | order(order asc),
    footerText,
    contactEmail,
    address,
    ${seoProjection},
    maintenanceMode,
    announcementBar {
      enabled,
      message,
      link,
      bgColor
    }
  }
`;

export const navItemsQuery = groq`
  *[_type == "navItem" && isActive == true] | order(order asc) {
    _id,
    label,
    href,
    isExternal,
    order
  }
`;

export const socialLinksQuery = groq`
  *[_type == "socialLink"] | order(order asc) {
    _id,
    platform,
    url,
    label
  }
`;

// ============================================
// EVENTS QUERIES
// ============================================

export const allEventsQuery = groq`
  *[_type == "event"] | order(startDate desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "coverImage": coverImage { ${imageProjection} },
    eventType,
    status,
    startDate,
    endDate,
    venue,
    isOnline,
    registrationLink,
    registrationDeadline,
    featured,
    tags
  }
`;

export const upcomingEventsQuery = groq`
  *[_type == "event" && (status == "upcoming" || status == "ongoing")] | order(startDate asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "coverImage": coverImage { ${imageProjection} },
    eventType,
    status,
    startDate,
    endDate,
    venue,
    isOnline,
    registrationLink,
    registrationDeadline,
    featured,
    tags
  }
`;

export const featuredEventsQuery = groq`
  *[_type == "event" && featured == true] | order(startDate desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    description,
    "coverImage": coverImage { ${imageProjection} },
    eventType,
    status,
    startDate,
    endDate,
    venue,
    isOnline,
    registrationLink
  }
`;

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    content,
    "coverImage": coverImage { ${imageProjection} },
    "gallery": gallery[] { ${imageProjection} },
    eventType,
    status,
    startDate,
    endDate,
    venue,
    isOnline,
    registrationLink,
    registrationDeadline,
    maxParticipants,
    speakers[] {
      _key,
      name,
      role,
      "image": image { ${imageProjection} },
      bio
    },
    sponsors[] {
      _key,
      name,
      "logo": logo { ${imageProjection} },
      website
    },
    tags,
    featured,
    ${seoProjection}
  }
`;

export const eventSlugsQuery = groq`
  *[_type == "event" && defined(slug.current)] {
    "slug": slug.current
  }
`;

// ============================================
// TEAM QUERIES
// ============================================

export const allTeamMembersQuery = groq`
  *[_type == "teamMember" && isActive == true] | order(order asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    role,
    category,
    "image": image { ${imageProjection} },
    bio,
    year,
    branch,
    codeforcesHandle,
    codechefHandle,
    leetcodeHandle,
    githubHandle,
    linkedinUrl,
    email,
    achievements
  }
`;

export const teamMembersByCategoryQuery = groq`
  *[_type == "teamMember" && isActive == true && category == $category] | order(order asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    role,
    category,
    "image": image { ${imageProjection} },
    bio,
    year,
    branch,
    codeforcesHandle,
    codechefHandle,
    leetcodeHandle,
    githubHandle,
    linkedinUrl,
    email,
    achievements
  }
`;

export const coreTeamQuery = groq`
  *[_type == "teamMember" && isActive == true && category in ["core", "coordinator"]] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    role,
    category,
    "image": image { ${imageProjection} },
    bio,
    codeforcesHandle,
    codechefHandle,
    githubHandle,
    linkedinUrl
  }
`;

export const teamMemberBySlugQuery = groq`
  *[_type == "teamMember" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    role,
    category,
    "image": image { ${imageProjection} },
    bio,
    year,
    branch,
    codeforcesHandle,
    codechefHandle,
    leetcodeHandle,
    githubHandle,
    linkedinUrl,
    email,
    achievements,
    joinedAt
  }
`;

// ============================================
// BLOG QUERIES
// ============================================

export const allBlogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage { ${imageProjection} },
    "author": author-> { ${authorProjection} },
    categories,
    tags,
    publishedAt,
    readTime,
    featured
  }
`;

export const featuredBlogPostsQuery = groq`
  *[_type == "blogPost" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage { ${imageProjection} },
    "author": author-> { ${authorProjection} },
    publishedAt,
    readTime
  }
`;

export const recentBlogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) [0...6] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage { ${imageProjection} },
    "author": author-> { ${authorProjection} },
    publishedAt,
    readTime,
    categories
  }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    "coverImage": coverImage { ${imageProjection} },
    "author": author-> { ${authorProjection} },
    categories,
    tags,
    publishedAt,
    readTime,
    featured,
    ${seoProjection},
    "relatedPosts": *[_type == "blogPost" && slug.current != $slug && count(categories[@ in ^.categories]) > 0] | order(publishedAt desc) [0...3] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "coverImage": coverImage { ${imageProjection} },
      publishedAt,
      readTime
    }
  }
`;

export const blogPostSlugsQuery = groq`
  *[_type == "blogPost" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const blogCategoriesQuery = groq`
  *[_type == "blogPost"] {
    categories
  } | {
    "categories": categories[]
  }
`;

// ============================================
// ACHIEVEMENTS QUERIES
// ============================================

export const allAchievementsQuery = groq`
  *[_type == "achievement"] | order(date desc) {
    _id,
    title,
    description,
    contestName,
    platform,
    rank,
    rankTitle,
    date,
    "image": image { ${imageProjection} },
    proofLink,
    "members": members[]-> {
      _id,
      name,
      "slug": slug.current,
      "image": image { ${imageProjection} }
    },
    category,
    featured
  }
`;

export const featuredAchievementsQuery = groq`
  *[_type == "achievement" && featured == true] | order(date desc) [0...6] {
    _id,
    title,
    description,
    contestName,
    platform,
    rank,
    rankTitle,
    date,
    "image": image { ${imageProjection} },
    proofLink,
    "members": members[]-> {
      _id,
      name,
      "slug": slug.current,
      "image": image { ${imageProjection} }
    },
    category
  }
`;

export const achievementsByCategoryQuery = groq`
  *[_type == "achievement" && category == $category] | order(date desc) {
    _id,
    title,
    description,
    contestName,
    platform,
    rank,
    rankTitle,
    date,
    "image": image { ${imageProjection} },
    proofLink,
    "members": members[]-> {
      _id,
      name,
      "slug": slug.current,
      "image": image { ${imageProjection} }
    },
    category,
    featured
  }
`;

export const achievementsByPlatformQuery = groq`
  *[_type == "achievement" && platform == $platform] | order(date desc) {
    _id,
    title,
    description,
    contestName,
    platform,
    rank,
    rankTitle,
    date,
    "image": image { ${imageProjection} },
    proofLink,
    "members": members[]-> {
      _id,
      name,
      "slug": slug.current
    },
    category,
    featured
  }
`;

// ============================================
// SEARCH QUERIES
// ============================================

export const searchQuery = groq`
  {
    "events": *[_type == "event" && (title match $query || description match $query)] [0...5] {
      _id,
      _type,
      title,
      "slug": slug.current,
      description,
      "coverImage": coverImage { ${imageProjection} }
    },
    "blogs": *[_type == "blogPost" && (title match $query || excerpt match $query)] [0...5] {
      _id,
      _type,
      title,
      "slug": slug.current,
      excerpt,
      "coverImage": coverImage { ${imageProjection} }
    },
    "members": *[_type == "teamMember" && (name match $query || role match $query)] [0...5] {
      _id,
      _type,
      name,
      "slug": slug.current,
      role,
      "image": image { ${imageProjection} }
    }
  }
`;

// ============================================
// STATS QUERIES
// ============================================

export const statsQuery = groq`
  {
    "totalEvents": count(*[_type == "event"]),
    "totalMembers": count(*[_type == "teamMember" && isActive == true]),
    "totalBlogPosts": count(*[_type == "blogPost"]),
    "totalAchievements": count(*[_type == "achievement"]),
    "upcomingEvents": count(*[_type == "event" && status == "upcoming"])
  }
`;
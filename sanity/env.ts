// sanity/env.ts

/**
 * Sanity Environment Variables
 * 
 * These are validated at build time to ensure proper configuration
 */

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
);

// Token for server-side operations (write access)
export const token = process.env.SANITY_API_TOKEN;

// Studio URL for preview functionality
export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '/studio';

// Helper function to validate required values
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}

// Determine if we're in production
export const isProduction = process.env.NODE_ENV === 'production';

// Revalidation settings
export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET;
// lib/sanity.client.ts
// Sanity client configuration

import { createClient, type ClientConfig } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

// Validate environment variables
if (!projectId) {
  throw new Error(
    'Missing Sanity project ID. Please set NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID environment variable.'
  );
}

// Client configuration
const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
};

// Public client (read-only, uses CDN in production)
export const sanityClient = createClient(config);

// Preview client (no CDN, for draft content)
export const previewClient = createClient({
  ...config,
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_READ_TOKEN,
});

// Write client (for mutations, server-side only)
export const writeClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// Get appropriate client based on preview mode
export function getClient(preview?: boolean) {
  return preview ? previewClient : sanityClient;
}

// Export configuration for use in other files
export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
};

export default sanityClient;
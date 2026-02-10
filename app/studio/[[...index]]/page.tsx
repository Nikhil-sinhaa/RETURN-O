// app/studio/[[...index]]/page.tsx
'use client';

/**
 * Sanity Studio - Protected Admin Interface
 * 
 * This page embeds Sanity Studio for content management.
 * Protected by HTTP Basic Auth via middleware.ts
 * 
 * Access: /studio
 * Credentials: Set STUDIO_PASSWORD in environment variables
 */

import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity/sanity.config';

export default function StudioPage() {
  return (
    <NextStudio
      config={config}
      // Enables the studio to detect if it's embedded
      unstable_globalStyles
    />
  );
}
// lib/sanity.image.ts
// Sanity image URL builder

import imageUrlBuilder from '@sanity/image-url';
import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanityClient } from './sanity.client';
import type { SanityImage } from './types';

// Create the image URL builder
const builder = imageUrlBuilder(sanityClient);

/**
 * Generate image URL from Sanity image source
 */
export function urlFor(source: SanityImageSource): ImageUrlBuilder {
  return builder.image(source);
}

/**
 * Get optimized image URL with default parameters
 */
export function getImageUrl(
  image: SanityImage | undefined,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    blur?: number;
    format?: 'jpg' | 'png' | 'webp' | 'auto';
  }
): string {
  if (!image?.asset) {
    return '/images/placeholder.jpg';
  }

  let imageBuilder = urlFor(image);

  if (options?.width) {
    imageBuilder = imageBuilder.width(options.width);
  }

  if (options?.height) {
    imageBuilder = imageBuilder.height(options.height);
  }

  if (options?.quality) {
    imageBuilder = imageBuilder.quality(options.quality);
  }

  if (options?.blur) {
    imageBuilder = imageBuilder.blur(options.blur);
  }

  if (options?.format) {
    imageBuilder = imageBuilder.format(options.format as 'jpg' | 'png' | 'webp');
  } else {
    imageBuilder = imageBuilder.auto('format');
  }

  return imageBuilder.url();
}

/**
 * Get responsive image URLs for srcset
 */
export function getResponsiveImageUrls(
  image: SanityImage | undefined,
  widths: number[] = [320, 640, 960, 1280, 1920]
): { src: string; srcSet: string; sizes: string } {
  if (!image?.asset) {
    return {
      src: '/images/placeholder.jpg',
      srcSet: '',
      sizes: '',
    };
  }

  const srcSet = widths
    .map((width) => {
      const url = urlFor(image).width(width).auto('format').quality(80).url();
      return `${url} ${width}w`;
    })
    .join(', ');

  const sizes = widths
    .map((width, index) => {
      if (index === widths.length - 1) {
        return `${width}px`;
      }
      return `(max-width: ${width}px) ${width}px`;
    })
    .join(', ');

  const src = urlFor(image).width(widths[2] || 960).auto('format').quality(80).url();

  return { src, srcSet, sizes };
}

/**
 * Get low-quality image placeholder (LQIP)
 */
export function getLqip(image: SanityImage | undefined): string {
  if (!image?.asset) {
    return '';
  }

  return urlFor(image).width(20).quality(30).blur(10).url();
}

/**
 * Get image dimensions from asset reference
 */
export function getImageDimensions(image: SanityImage | undefined): {
  width: number;
  height: number;
  aspectRatio: number;
} | null {
  if (!image?.asset?._ref) {
    return null;
  }

  // Asset reference format: image-{id}-{width}x{height}-{format}
  const ref = image.asset._ref;
  const match = ref.match(/image-\w+-(\d+)x(\d+)-\w+/);

  if (!match) {
    return null;
  }

  const width = parseInt(match[1] || '0', 10);
  const height = parseInt(match[2] || '0', 10);
  const aspectRatio = width / height;

  return { width, height, aspectRatio };
}

/**
 * Get cropped image URL respecting hotspot and crop
 */
export function getCroppedImageUrl(
  image: SanityImage | undefined,
  width: number,
  height: number
): string {
  if (!image?.asset) {
    return '/images/placeholder.jpg';
  }

  let imageBuilder = urlFor(image)
    .width(width)
    .height(height)
    .fit('crop')
    .auto('format')
    .quality(80);

  // Apply hotspot if available
  if (image.hotspot) {
    imageBuilder = imageBuilder.focalPoint(image.hotspot.x, image.hotspot.y);
  }

  return imageBuilder.url();
}

/**
 * Get Open Graph image URL (1200x630)
 */
export function getOgImageUrl(image: SanityImage | undefined): string {
  return getCroppedImageUrl(image, 1200, 630);
}

/**
 * Get Twitter card image URL (1200x600)
 */
export function getTwitterImageUrl(image: SanityImage | undefined): string {
  return getCroppedImageUrl(image, 1200, 600);
}

/**
 * Get thumbnail image URL
 */
export function getThumbnailUrl(
  image: SanityImage | undefined,
  size: 'small' | 'medium' | 'large' = 'medium'
): string {
  const sizes = {
    small: { width: 100, height: 100 },
    medium: { width: 300, height: 300 },
    large: { width: 500, height: 500 },
  };

  const { width, height } = sizes[size];
  return getCroppedImageUrl(image, width, height);
}

/**
 * Get avatar image URL (circular crop)
 */
export function getAvatarUrl(
  image: SanityImage | undefined,
  size: number = 200
): string {
  if (!image?.asset) {
    return `https://ui-avatars.com/api/?size=${size}&background=9D4EDD&color=fff`;
  }

  return urlFor(image)
    .width(size)
    .height(size)
    .fit('crop')
    .auto('format')
    .quality(90)
    .url();
}

export default urlFor;
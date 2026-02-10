'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react';
import { GlassCard } from '@/components/effects/GlassCard';
import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
import urlForImage from '@/lib/sanity.image';
import type { BlogPost } from '@/lib/types';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = useMemo(() => {
    const date = new Date(post.publishedAt);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [post.publishedAt]);

  const readingTime = useMemo(() => {
    if (post.readingTime) return post.readingTime;
    // Estimate based on content length if available
    if (post.body) {
      const wordCount = JSON.stringify(post.body).split(/\s+/).length;
      return `${Math.ceil(wordCount / 200)} min read`;
    }
    return '5 min read';
  }, [post.readingTime, post.body]);

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`}>
        <GlassCard
          hover="glow"
          glowColor="pink"
          className="group overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            {post.coverImage && (
              <div className="relative h-64 md:h-auto md:w-1/2">
                <Image
                  src={urlForImage(post.coverImage).url()}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80 md:bg-gradient-to-l" />

                {/* Featured badge */}
                <div className="absolute left-4 top-4">
                  <Badge className="bg-neon-pink text-white">
                    Featured
                  </Badge>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex flex-1 flex-col justify-center p-8">
              {/* Category */}
              {post.category && (
                <Badge variant="outline" className="mb-4 w-fit border-electric-purple/50 text-electric-purple">
                  {post.category}
                </Badge>
              )}

              {/* Title */}
              <h2 className="mb-4 text-2xl font-bold text-white transition-colors group-hover:text-neon-pink md:text-3xl">
                {post.title}
              </h2>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="mb-6 line-clamp-3 text-white/60">
                  {post.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-white/50">
                {post.author && (
                  <div className="flex items-center gap-2">
                    {post.author.image ? (
                      <Image
                        src={urlForImage(post.author.image).url()}
                        alt={post.author.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span>{post.author.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime}</span>
                </div>
              </div>

              {/* Read more */}
              <div className="flex items-center gap-2 font-medium text-neon-pink transition-all group-hover:gap-3">
                Read Article
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </GlassCard>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`}>
      <GlassCard
        hover="glow"
        glowColor="purple"
        className="group flex h-full flex-col overflow-hidden"
      >
        {/* Image */}
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={urlForImage(post.coverImage).url()}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          {/* Category */}
          {post.category && (
            <Badge
              variant="outline"
              className="mb-3 w-fit border-electric-purple/50 text-electric-purple"
            >
              {post.category}
            </Badge>
          )}

          {/* Title */}
          <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-white transition-colors group-hover:text-neon-pink">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mb-4 line-clamp-2 flex-1 text-sm text-white/60">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/50"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/40">
            <div className="flex items-center gap-3">
              {post.author && (
                <div className="flex items-center gap-1.5">
                  {post.author.image ? (
                    <Image
                      src={urlForImage(post.author.image).url()}
                      alt={post.author.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span>{post.author.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{readingTime}</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
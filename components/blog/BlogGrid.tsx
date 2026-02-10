'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen } from 'lucide-react';
import { BlogCard } from './BlogCard';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/lib/types';

interface BlogGridProps {
  posts: BlogPost[];
  showSearch?: boolean;
  showFilters?: boolean;
  showFeatured?: boolean;
  limit?: number;
}

export function BlogGrid({
  posts,
  showSearch = true,
  showFilters = true,
  showFeatured = true,
  limit,
}: BlogGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach((post) => {
      if (post.category) cats.add(post.category);
    });
    return ['all', ...Array.from(cats)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.author?.name?.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (post) => post.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [posts, searchQuery, selectedCategory, limit]);

  // Get featured post (first post with featured flag or most recent)
  const featuredPost = useMemo(() => {
    if (!showFeatured) return null;
    return posts.find((p) => p.featured) || posts[0];
  }, [posts, showFeatured]);

  // Get remaining posts excluding featured
  const remainingPosts = useMemo(() => {
    if (!showFeatured || !featuredPost) return filteredPosts;
    return filteredPosts.filter((p) => p._id !== featuredPost._id);
  }, [filteredPosts, featuredPost, showFeatured]);

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          {showSearch && (
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* Category Filters */}
          {showFilters && categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium capitalize transition-all',
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-neon-pink to-electric-purple text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {category === 'all' ? 'All Posts' : category}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-white/40">
        <BookOpen className="h-4 w-4" />
        <span>
          {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
      </div>

      {/* Featured Post */}
      {showFeatured && featuredPost && !searchQuery && selectedCategory === 'all' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BlogCard post={featuredPost} featured />
        </motion.div>
      )}

      {/* Posts Grid */}
      {remainingPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-white/10 bg-white/5 p-12 text-center"
        >
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-white/30" />
          <h3 className="mb-2 text-lg font-semibold text-white">
            No articles found
          </h3>
          <p className="text-white/60">
            {searchQuery
              ? `No articles matching "${searchQuery}"`
              : 'No articles in this category yet.'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {remainingPosts.map((post, index) => (
              <motion.div
                key={post._id || (typeof post.slug === 'string' ? post.slug : post.slug?.current)}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
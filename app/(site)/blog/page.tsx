// app/(site)/blog/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllBlogPosts } from '@/lib/sanity.fetch';
import { BlogGrid } from '@/components/blog/BlogGrid';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { GradientOrb } from '@/components/effects/GradientOrb';
import { GridBackground } from '@/components/effects/GridBackground';
import { BookOpen, Lightbulb, FileText } from 'lucide-react';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}
export const metadata: Metadata = {
  title: 'Blog | RETURN 0; - IIIT Dharwad',
  description: 'Read our latest articles on competitive programming, algorithms, data structures, and coding tips.',
};
function SectionHeader({ title, subtitle, icon }: SectionHeaderProps) {
  return (
    <div className="mb-8 text-center">
      {icon && <div className="flex justify-center mb-2">{icon}</div>}
      {subtitle && (
        <div className="mb-2 text-lg text-gray-400">{subtitle}</div>
      )}
      <h2 className="text-3xl font-bold">{title}</h2>
    </div>
  );
}
async function BlogContent() {
  const posts = await getAllBlogPosts();

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-6">📝</div>
        <h3 className="text-2xl font-semibold text-white mb-4">No Posts Yet</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          We're working on some great content. Check back soon for articles on
          competitive programming, algorithms, and more!
        </p>
      </div>
    );
  }

  // Separate featured and regular posts
  const featuredPosts = posts.filter(p => p.featured);
  const regularPosts = posts.filter(p => !p.featured);

  return (
    <div className="space-y-16">
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section>
          <SectionHeader
            title="Featured Articles"
            subtitle="Our top picks for you"
            icon={<Lightbulb className="w-6 h-6" />}
          />
          <BlogGrid posts={featuredPosts} />
        </section>
      )}

      {/* All Posts */}
      <section>
        <SectionHeader
          title="All Articles"
          subtitle="Explore our collection of programming wisdom"
          icon={<FileText className="w-6 h-6" />}
        />
        <BlogGrid posts={regularPosts.length > 0 ? regularPosts : posts} />
      </section>
    </div>
  );
}

export default function BlogPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 relative">
      <GridBackground />

      {/* Decorative orbs */}
      <GradientOrb
        color="yellow"
        className="absolute left-0 top-20 w-[500px] h-[500px] opacity-20"
      />
      <GradientOrb
        color="pink"
        className="absolute right-0 bottom-40 w-[400px] h-[400px] opacity-20"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFEA00]/20 border border-[#FFEA00]/50 mb-6">
            <BookOpen className="w-4 h-4 text-[#FFEA00]" />
            <span className="text-sm text-[#FFEA00]">Knowledge Base</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#FF006E] via-[#9D4EDD] to-[#00F5FF] bg-clip-text text-transparent">
              RETURN 0; Blog
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Dive into competitive programming concepts, algorithm tutorials,
            contest editorials, and tips from our community.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {[
            { icon: '🧮', label: 'Algorithms', color: '#FF006E' },
            { icon: '🏗️', label: 'Data Structures', color: '#9D4EDD' },
            { icon: '📊', label: 'Editorials', color: '#00F5FF' },
            { icon: '💡', label: 'Tips & Tricks', color: '#FFEA00' },
            { icon: '🎯', label: 'Interview Prep', color: '#00EA64' },
          ].map((category) => (
            <button
              key={category.label}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgba(18,18,26,0.75)] backdrop-blur-xl border border-white/10 hover:border-opacity-50 transition-all duration-300 text-gray-300 hover:text-white"
            >
              <span>{category.icon}</span>
              <span className="text-sm">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Blog Content */}
        <Suspense fallback={<LoadingSpinner />}>
          <BlogContent />
        </Suspense>
      </div>
    </main>
  );
}
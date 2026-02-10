// app/(site)/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/sanity.fetch';
import urlForImage from '@/lib/sanity.image';
import PortableTextRenderer from '@/components/blog/PortableTextRenderer';
import { GradientOrb } from '@/components/effects/GradientOrb';
import { GridBackground } from '@/components/effects/GridBackground';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Twitter,
  Linkedin,
  Link as LinkIcon
} from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts?.map((post) => ({ slug: post.slug.current })) || [];
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | RETURN 0;',
    };
  }

  return {
    title: `${post.title} | RETURN 0; Blog`,
    description: post.excerpt || `Read ${post.title} on RETURN 0; Blog`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author?.name || 'RETURN 0;'],
      images: post.coverImage ? [{ url: urlForImage(post.coverImage).url() }] : [],
    },
  };
}

function calculateReadTime(content: any[] | undefined): number {
  if (!content) return 5;
  const text = content
    .filter((block: any) => block._type === 'block')
    .map((block: any) => block.children?.map((child: any) => child.text).join(''))
    .join(' ');
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute) || 5;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readTime = calculateReadTime(post.content);

  return (
    <main className="min-h-screen pt-24 pb-16 relative">
      <GridBackground />

      <GradientOrb
        color="purple"
        className="absolute right-0 top-20 w-[500px] h-[500px] opacity-20"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Back Button */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category: string) => (
                  <Badge
                    key={category}
                    className="border-[#9D4EDD]/50 text-[#9D4EDD]"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.image && (
                    <Image
                      src={urlForImage(post.author.image).width(40).height(40).url()}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-white font-medium">{post.author.name}</p>
                    {post.author.role && (
                      <p className="text-xs text-gray-500">{post.author.role}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{publishedDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12">
              <Image
                src={urlForImage(post.coverImage).width(1200).height(675).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none mb-12">
            <PortableTextRenderer content={post.content} />
          </div>

          {/* Share Section */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-gray-400 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share this article
              </p>
              <div className="flex gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://return0.iiitdwd.ac.in/blog/${post.slug.current}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-[rgba(18,18,26,0.75)] border border-white/10 hover:border-[#1DA1F2]/50 hover:text-[#1DA1F2] transition-all duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://return0.iiitdwd.ac.in/blog/${post.slug.current}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-[rgba(18,18,26,0.75)] border border-white/10 hover:border-[#0A66C2]/50 hover:text-[#0A66C2] transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(`https://return0.iiitdwd.ac.in/blog/${post.slug.current}`)}
                  className="p-3 rounded-lg bg-[rgba(18,18,26,0.75)] border border-white/10 hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all duration-300"
                >
                  <LinkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Author Bio */}
          {post.author && post.author.bio && (
            <div className="mt-12 p-6 rounded-xl bg-[rgba(18,18,26,0.75)] backdrop-blur-xl border border-white/10">
              <div className="flex items-start gap-4">
                {post.author.image && (
                  <Image
                    src={urlForImage(post.author.image).width(80).height(80).url()}
                    alt={post.author.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Written by</p>
                  <h4 className="text-xl font-semibold text-white mb-2">{post.author.name}</h4>
                  <p className="text-gray-400 text-sm">{post.author.bio}</p>
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}
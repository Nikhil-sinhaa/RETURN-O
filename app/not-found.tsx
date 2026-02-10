'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientOrb } from '@/components/effects/GradientOrb';
import { GridBackground } from '@/components/effects/GridBackground';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <GradientOrb color="pink" position="top-left" size="xl" />
        <GradientOrb color="purple" position="bottom-right" size="lg" />
        <GridBackground variant="lines" opacity={0.02} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="font-mono text-[150px] font-bold leading-none md:text-[200px]">
            <span className="bg-gradient-to-r from-neon-pink via-electric-purple to-neon-cyan bg-clip-text text-transparent">
              4
            </span>
            <motion.span
              animate={{
                opacity: [1, 0.5, 1],
                textShadow: [
                  '0 0 20px #FF006E',
                  '0 0 40px #FF006E',
                  '0 0 20px #FF006E',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-neon-pink"
            >
              0
            </motion.span>
            <span className="bg-gradient-to-r from-neon-cyan via-electric-purple to-neon-pink bg-clip-text text-transparent">
              4
            </span>
          </span>
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Page Not Found
          </h1>
          <p className="text-lg text-white/60">
            Looks like this page returned an error instead of 0.
            <br />
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </motion.div>

        {/* Terminal output */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 overflow-hidden rounded-lg border border-white/10 bg-background/80 font-mono text-sm backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-white/40">terminal</span>
          </div>
          <div className="p-4 text-left">
            <p className="text-white/60">
              <span className="text-neon-cyan">~$</span> find /page -name &quot;requested&quot;
            </p>
            <p className="mt-2 text-red-400">
              Error: Page not found (404)
            </p>
            <p className="mt-2 text-white/60">
              <span className="text-neon-cyan">~$</span> return 404;
              <span className="ml-1 animate-pulse text-neon-pink">▊</span>
            </p>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-neon-pink to-electric-purple"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/contests">
              <Search className="mr-2 h-5 w-5" />
              View Contests
            </Link>
          </Button>
        </motion.div>

        {/* Helpful links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12"
        >
          <p className="mb-4 text-sm text-white/40">Or try these pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              { label: 'Events', href: '/events' },
              { label: 'Team', href: '/team' },
              { label: 'Blog', href: '/blog' },
              { label: 'Contact', href: '/contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/60 transition-colors hover:text-neon-pink"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
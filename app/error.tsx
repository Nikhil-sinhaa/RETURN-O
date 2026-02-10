'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientOrb } from '@/components/effects/GradientOrb';
import { GridBackground } from '@/components/effects/GridBackground';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <GradientOrb color="pink" position="top-right" size="xl" />
        <GradientOrb color="purple" position="bottom-left" size="lg" />
        <GridBackground variant="lines" opacity={0.02} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        {/* Error icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Something Went Wrong
          </h1>
          <p className="text-lg text-white/60">
            An unexpected error occurred. Don&apos;t worry, our code usually
            returns 0, but this time it threw an exception.
          </p>
        </motion.div>

        {/* Error details (dev only) */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8 overflow-hidden rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-left"
          >
            <p className="mb-2 font-mono text-sm text-red-400">
              {error.name}: {error.message}
            </p>
            {error.digest && (
              <p className="font-mono text-xs text-white/40">
                Digest: {error.digest}
              </p>
            )}
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-neon-pink to-electric-purple"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </Button>

          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
        </motion.div>

        {/* Support text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 text-sm text-white/40"
        >
          If this problem persists, please{' '}
          <Link href="/contact" className="text-neon-pink hover:underline">
            contact us
          </Link>
          .
        </motion.p>
      </div>
    </div>
  );
}

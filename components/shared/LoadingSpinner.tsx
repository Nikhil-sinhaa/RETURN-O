'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'pink' | 'purple' | 'cyan' | 'white';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const colorClasses = {
  pink: 'border-neon-pink',
  purple: 'border-electric-purple',
  cyan: 'border-neon-cyan',
  white: 'border-white',
};

export default function LoadingSpinner({
  size = 'md',
  color = 'pink',
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
}

// Full page loading state
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Outer ring */}
          <motion.div
            className="h-16 w-16 rounded-full border-2 border-neon-pink/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-t-transparent border-electric-purple"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />

          {/* Center dot */}
          <motion.div
            className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-neon-cyan"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ boxShadow: '0 0 20px #00F5FF' }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 font-mono text-sm text-white/50"
        >
          Loading<span className="animate-pulse">...</span>
        </motion.p>
      </div>
    </div>
  );
}

// Skeleton loader for cards
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl border border-white/10 bg-glass p-6',
        className
      )}
    >
      <div className="mb-4 h-4 w-1/3 rounded bg-white/10" />
      <div className="mb-2 h-6 w-2/3 rounded bg-white/10" />
      <div className="h-4 w-full rounded bg-white/10" />
      <div className="mt-2 h-4 w-4/5 rounded bg-white/10" />
    </div>
  );
}

// Grid of skeleton cards
export function SkeletonGrid({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
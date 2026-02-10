// components/ui/skeleton.tsx
// Skeleton loading component

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text' | 'card';
}

function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-white/10';

  const variantClasses = {
    default: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4 w-full',
    card: 'rounded-2xl',
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

// Pre-built skeleton components
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-glass border border-white/10 p-6 space-y-4',
        className
      )}
    >
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

function SkeletonContestCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-glass border border-white/10 p-6 space-y-4',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-4 pt-2">
        <div className="text-center">
          <Skeleton className="h-8 w-12 mx-auto" />
          <Skeleton className="h-3 w-10 mt-1 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-8 w-12 mx-auto" />
          <Skeleton className="h-3 w-10 mt-1 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-8 w-12 mx-auto" />
          <Skeleton className="h-3 w-10 mt-1 mx-auto" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-lg mt-4" />
    </div>
  );
}

function SkeletonTeamMember({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-glass border border-white/10 p-6 text-center space-y-4',
        className
      )}
    >
      <Skeleton className="h-24 w-24 rounded-full mx-auto" />
      <Skeleton className="h-5 w-32 mx-auto" />
      <Skeleton className="h-4 w-24 mx-auto" />
      <div className="flex justify-center gap-3 pt-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

function SkeletonBlogPost({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-glass border border-white/10 overflow-hidden',
        className
      )}
    >
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  );
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonContestCard,
  SkeletonTeamMember,
  SkeletonBlogPost,
  SkeletonText,
};
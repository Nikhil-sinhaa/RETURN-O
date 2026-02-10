// components/ui/badge.tsx
// Badge component with multiple variants

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-gradient-to-r from-neon-pink to-electric-purple text-white',
        secondary:
          'border-transparent bg-white/10 text-white/80 hover:bg-white/20',
        destructive:
          'border-transparent bg-red-500/20 text-red-400 border-red-500/30',
        outline:
          'border-electric-purple/50 text-electric-purple bg-transparent',
        success:
          'border-transparent bg-green-500/20 text-green-400 border-green-500/30',
        warning:
          'border-transparent bg-cyber-yellow/20 text-cyber-yellow border-cyber-yellow/30',
        info:
          'border-transparent bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
        neon:
          'border-neon-pink bg-neon-pink/10 text-neon-pink',
        glow:
          'border-transparent bg-gradient-to-r from-neon-pink/20 to-electric-purple/20 text-white backdrop-blur-sm',
        // Platform-specific badges
        codeforces:
          'border-transparent bg-[#1F8ACB]/20 text-[#1F8ACB]',
        codechef:
          'border-transparent bg-[#5B4638]/20 text-[#D4A574]',
        leetcode:
          'border-transparent bg-[#FFA116]/20 text-[#FFA116]',
        atcoder:
          'border-transparent bg-[#222222]/20 text-white border-white/20',
        hackerrank:
          'border-transparent bg-[#2EC866]/20 text-[#2EC866]',
        hackerearth:
          'border-transparent bg-[#323754]/20 text-[#6B7BF7]',
        geeksforgeeks:
          'border-transparent bg-[#2F8D46]/20 text-[#2F8D46]',
      },
      size: {
        default: 'px-3 py-1 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
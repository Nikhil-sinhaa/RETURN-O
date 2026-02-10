'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'solid' | 'subtle';
  hover?: 'glow' | 'lift' | 'border' | 'none';
  glowColor?: 'pink' | 'purple' | 'cyan' | 'yellow' | 'gradient';
  animated?: boolean;
  motionProps?: MotionProps;
}

const glowColors = {
  pink: {
    border: 'hover:border-neon-pink/50',
    shadow: 'hover:shadow-[0_0_30px_rgba(255,0,110,0.3)]',
    gradient: 'from-neon-pink/20 to-transparent',
  },
  purple: {
    border: 'hover:border-electric-purple/50',
    shadow: 'hover:shadow-[0_0_30px_rgba(157,78,221,0.3)]',
    gradient: 'from-electric-purple/20 to-transparent',
  },
  cyan: {
    border: 'hover:border-neon-cyan/50',
    shadow: 'hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]',
    gradient: 'from-neon-cyan/20 to-transparent',
  },
  yellow: {
    border: 'hover:border-cyber-yellow/50',
    shadow: 'hover:shadow-[0_0_30px_rgba(255,234,0,0.3)]',
    gradient: 'from-cyber-yellow/20 to-transparent',
  },
  gradient: {
    border: 'hover:border-neon-pink/50',
    shadow: 'hover:shadow-[0_0_30px_rgba(255,0,110,0.2),0_0_60px_rgba(157,78,221,0.1)]',
    gradient: 'from-neon-pink/10 via-electric-purple/10 to-neon-cyan/10',
  },
};

const variants = {
  default: 'bg-glass border border-white/10',
  solid: 'bg-background border border-white/10',
  subtle: 'bg-white/5 border border-white/5',
};

const hoverEffects = {
  glow: 'transition-all duration-300',
  lift: 'transition-transform duration-300 hover:-translate-y-1',
  border: 'transition-all duration-300',
  none: '',
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant = 'default',
      hover = 'glow',
      glowColor = 'gradient',
      animated = true,
      motionProps,
      children,
      ...props
    },
    ref
  ) => {
    const colorStyles = glowColors[glowColor];
    
    const baseClasses = cn(
      'relative overflow-hidden rounded-xl backdrop-blur-xl',
      variants[variant],
      hover !== 'none' && hoverEffects[hover],
      hover === 'glow' && [colorStyles.border, colorStyles.shadow],
      hover === 'border' && colorStyles.border,
      className
    );

    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={baseClasses}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          {...motionProps}
          {...(props as any)}
        >
          {/* Gradient overlay on hover */}
          {hover === 'glow' && (
            <div
              className={cn(
                'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                colorStyles.gradient
              )}
            />
          )}
          
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={baseClasses} {...props}>
        {hover === 'glow' && (
          <div
            className={cn(
              'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
              colorStyles.gradient
            )}
          />
        )}
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
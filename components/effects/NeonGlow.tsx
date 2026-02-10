'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeonGlowProps extends HTMLAttributes<HTMLDivElement> {
  color?: 'pink' | 'purple' | 'cyan' | 'yellow' | 'gradient';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  pulse?: boolean;
  children: ReactNode;
}

const colorStyles = {
  pink: {
    text: 'text-neon-pink',
    shadow: '#FF006E',
  },
  purple: {
    text: 'text-electric-purple',
    shadow: '#9D4EDD',
  },
  cyan: {
    text: 'text-neon-cyan',
    shadow: '#00F5FF',
  },
  yellow: {
    text: 'text-cyber-yellow',
    shadow: '#FFEA00',
  },
  gradient: {
    text: 'bg-gradient-to-r from-neon-pink via-electric-purple to-neon-cyan bg-clip-text text-transparent',
    shadow: '#FF006E',
  },
};

const intensityStyles = {
  low: { blur: 10, opacity: 0.5 },
  medium: { blur: 20, opacity: 0.7 },
  high: { blur: 30, opacity: 1 },
};

export const NeonGlow = forwardRef<HTMLDivElement, NeonGlowProps>(
  (
    {
      className,
      color = 'pink',
      intensity = 'medium',
      animated = false,
      pulse = false,
      children,
      ...props
    },
    ref
  ) => {
    const colorStyle = colorStyles[color];
    const intensityStyle = intensityStyles[intensity];

    const glowStyle = {
      textShadow: color !== 'gradient'
        ? `0 0 ${intensityStyle.blur}px ${colorStyle.shadow}, 0 0 ${intensityStyle.blur * 2}px ${colorStyle.shadow}${Math.round(intensityStyle.opacity * 99).toString(16)}`
        : undefined,
    };

    if (animated || pulse) {
      return (
        <motion.div
          ref={ref}
          className={cn(colorStyle.text, className)}
          style={glowStyle}
          animate={
            pulse
              ? {
                  textShadow: [
                    `0 0 ${intensityStyle.blur}px ${colorStyle.shadow}, 0 0 ${intensityStyle.blur * 2}px ${colorStyle.shadow}40`,
                    `0 0 ${intensityStyle.blur * 1.5}px ${colorStyle.shadow}, 0 0 ${intensityStyle.blur * 3}px ${colorStyle.shadow}60`,
                    `0 0 ${intensityStyle.blur}px ${colorStyle.shadow}, 0 0 ${intensityStyle.blur * 2}px ${colorStyle.shadow}40`,
                  ],
                }
              : undefined
          }
          transition={
            pulse
              ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : undefined
          }
          {...(props as MotionProps)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(colorStyle.text, className)}
        style={glowStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeonGlow.displayName = 'NeonGlow';

// Utility component for neon text
interface NeonTextProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  color?: 'pink' | 'purple' | 'cyan' | 'yellow' | 'gradient';
  className?: string;
  glow?: boolean;
}

export function NeonText({
  children,
  as: Component = 'span',
  color = 'pink',
  className,
  glow = true,
}: NeonTextProps) {
  const colorStyle = colorStyles[color];
  
  if (!glow) {
    return (
      <Component className={cn(colorStyle.text, className)}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={cn(colorStyle.text, className)}
      style={{
        textShadow: color !== 'gradient'
          ? `0 0 20px ${colorStyle.shadow}, 0 0 40px ${colorStyle.shadow}80`
          : undefined,
      }}
    >
      {children}
    </Component>
  );
}
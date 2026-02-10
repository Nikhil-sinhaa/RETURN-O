'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientOrbProps {
  color?: 'pink' | 'purple' | 'cyan' | 'yellow' | 'mixed';
  color1?: string;
  color2?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'custom';
  customPosition?: { top?: string; left?: string; right?: string; bottom?: string };
  blur?: 'normal' | 'heavy' | 'extreme';
  animate?: boolean;
  className?: string;
}

const colors = {
  pink: 'bg-neon-pink',
  purple: 'bg-electric-purple',
  cyan: 'bg-neon-cyan',
  yellow: 'bg-cyber-yellow',
  mixed: 'bg-gradient-to-br from-neon-pink via-electric-purple to-neon-cyan',
};

const sizes = {
  sm: 'h-32 w-32',
  md: 'h-64 w-64',
  lg: 'h-96 w-96',
  xl: 'h-[500px] w-[500px]',
};

const positions = {
  'top-left': '-top-20 -left-20',
  'top-right': '-top-20 -right-20',
  'bottom-left': '-bottom-20 -left-20',
  'bottom-right': '-bottom-20 -right-20',
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  custom: '',
};

const blurs = {
  normal: 'blur-[100px]',
  heavy: 'blur-[150px]',
  extreme: 'blur-[200px]',
};

export function GradientOrb({
  color,
  color1,
  color2,
  size = 'lg',
  position = 'top-right',
  customPosition,
  blur = 'heavy',
  animate = true,
  className,
}: GradientOrbProps) {
  const positionClasses = position === 'custom' ? '' : positions[position];

  const baseClasses = cn(
    'pointer-events-none absolute rounded-full opacity-30',
    sizes[size],
    positionClasses,
    blurs[blur],
    className
  );

  const style =
    position === 'custom'
      ? {
        ...(customPosition || {}),
        background:
          color1 && color2 ? `radial-gradient(circle at center, ${color1}, ${color2})` : undefined,
      }
      : {
        background:
          color1 && color2 ? `radial-gradient(circle at center, ${color1}, ${color2})` : undefined,
      };

  if (animate) {
    return (
      <motion.div
        className={cn(baseClasses, color && !color1 && !color2 ? colors[color] : '')}
        style={style}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  }

  return (
    <div
      className={cn(baseClasses, color && !color1 && !color2 ? colors[color] : '')}
      style={style}
    />
  );
}

export function HeroOrbs() {
  return (
    <>
      <GradientOrb
        color="purple"
        position="top-right"
        size="xl"
        className="opacity-20"
      />
      <GradientOrb
        color="pink"
        position="bottom-left"
        size="lg"
        className="opacity-20"
      />
      <GradientOrb
        color="cyan"
        position="center"
        size="md"
        className="opacity-10"
      />
    </>
  );
}

export function PageOrbs() {
  return (
    <>
      <GradientOrb color="purple" position="top-right" size="lg" className="opacity-10" />
      <GradientOrb
        color="cyan"
        position="bottom-left"
        size="lg"
        className="opacity-10"
      />
    </>
  );
}

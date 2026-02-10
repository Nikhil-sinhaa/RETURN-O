'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  className,
  decimals = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  const spring = useSpring(0, {
    damping: 30,
    stiffness: 100,
    duration: duration * 1000,
  });

  const display = useTransform(spring, (current) =>
    decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString()
  );

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        spring.set(value);
        setHasAnimated(true);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isInView, hasAnimated, spring, value, delay]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

// Stat card with animated counter
interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon?: React.ReactNode;
  color?: 'pink' | 'purple' | 'cyan' | 'yellow';
  delay?: number;
}

const colorStyles = {
  pink: {
    border: 'border-neon-pink/20',
    bg: 'bg-neon-pink/5',
    text: 'text-neon-pink',
    glow: 'shadow-[0_0_30px_rgba(255,0,110,0.1)]',
  },
  purple: {
    border: 'border-electric-purple/20',
    bg: 'bg-electric-purple/5',
    text: 'text-electric-purple',
    glow: 'shadow-[0_0_30px_rgba(157,78,221,0.1)]',
  },
  cyan: {
    border: 'border-neon-cyan/20',
    bg: 'bg-neon-cyan/5',
    text: 'text-neon-cyan',
    glow: 'shadow-[0_0_30px_rgba(0,245,255,0.1)]',
  },
  yellow: {
    border: 'border-cyber-yellow/20',
    bg: 'bg-cyber-yellow/5',
    text: 'text-cyber-yellow',
    glow: 'shadow-[0_0_30px_rgba(255,234,0,0.1)]',
  },
};

export function StatCard({
  label,
  value,
  suffix = '',
  prefix = '',
  icon,
  color = 'pink',
  delay = 0,
}: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'group relative overflow-hidden rounded-xl border p-6 backdrop-blur-sm transition-all hover:scale-[1.02]',
        styles.border,
        styles.bg,
        styles.glow
      )}
    >
      {/* Background gradient */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100',
          'bg-gradient-to-br from-transparent to-white/5'
        )}
      />

      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className={cn('mb-4', styles.text)}>
            {icon}
          </div>
        )}

        {/* Value */}
        <div className={cn('text-4xl font-bold', styles.text)}>
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            delay={delay}
          />
        </div>

        {/* Label */}
        <p className="mt-2 text-sm text-white/60">{label}</p>
      </div>
    </motion.div>
  );
}
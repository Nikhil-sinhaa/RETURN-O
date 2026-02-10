'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  label?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg';
  gradient?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  label,
  align = 'center',
  size = 'md',
  gradient = true,
  className,
  icon,
}: SectionHeaderProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  const sizeClasses = {
    sm: {
      title: 'text-2xl md:text-3xl',
      subtitle: 'text-sm md:text-base',
      label: 'text-xs',
    },
    md: {
      title: 'text-3xl md:text-4xl lg:text-5xl',
      subtitle: 'text-base md:text-lg',
      label: 'text-sm',
    },
    lg: {
      title: 'text-4xl md:text-5xl lg:text-6xl',
      subtitle: 'text-lg md:text-xl',
      label: 'text-sm',
    },
  };

  return (
    <div className={cn('max-w-3xl', alignClasses[align], className)}>
      {/* Label */}
      {label && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span
            className={cn(
              'inline-block rounded-full border border-neon-pink/30 bg-neon-pink/10 px-4 py-1.5 font-mono uppercase tracking-wider text-neon-pink',
              sizeClasses[size].label
            )}
          >
            {label}
          </span>
        </motion.div>
      )}

      {/* Icon */}
      {icon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center justify-center text-neon-pink"
        >
          {icon}
        </motion.div>
      )}

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={cn(
          'font-bold tracking-tight',
          sizeClasses[size].title,
          gradient
            ? 'bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent'
            : 'text-white'
        )}
      >
        {title}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            'mt-4 text-white/60',
            sizeClasses[size].subtitle
          )}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={cn(
          'mt-6 h-px origin-left bg-gradient-to-r from-neon-pink via-electric-purple to-transparent',
          align === 'center' && 'mx-auto max-w-xs',
          align === 'right' && 'ml-auto max-w-xs origin-right'
        )}
      />
    </div>
  );
}
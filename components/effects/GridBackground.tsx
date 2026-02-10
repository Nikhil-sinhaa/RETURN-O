'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GridBackgroundProps {
  variant?: 'dots' | 'lines' | 'gradient-lines';
  color?: 'white' | 'cyan' | 'pink' | 'purple';
  opacity?: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const colorMap = {
  white: 'rgba(255, 255, 255, VAR)',
  cyan: 'rgba(0, 245, 255, VAR)',
  pink: 'rgba(255, 0, 110, VAR)',
  purple: 'rgba(157, 78, 221, VAR)',
};

const sizeMap = {
  sm: 20,
  md: 40,
  lg: 80,
};

export function GridBackground({
  variant = 'lines',
  color = 'white',
  opacity = 0.03,
  size = 'md',
  animated = false,
  className,
}: GridBackgroundProps) {
  const gridSize = sizeMap[size];
  const gridColor = colorMap[color].replace('VAR', opacity.toString());

  if (variant === 'dots') {
    return (
      <div
        className={cn('pointer-events-none absolute inset-0', className)}
        style={{
          backgroundImage: `radial-gradient(circle, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />
    );
  }

  if (variant === 'gradient-lines') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
        {/* Horizontal lines with gradient */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, transparent 0%, ${gridColor} 50%, transparent 100%),
              linear-gradient(to bottom, transparent calc(100% - 1px), ${gridColor} calc(100% - 1px))
            `,
            backgroundSize: `100% ${gridSize}px`,
          }}
        />
        
        {/* Vertical lines with gradient */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to bottom, transparent 0%, ${gridColor} 50%, transparent 100%),
              linear-gradient(to right, transparent calc(100% - 1px), ${gridColor} calc(100% - 1px))
            `,
            backgroundSize: `${gridSize}px 100%`,
          }}
        />

        {/* Animated glow effect */}
        {animated && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), ${colorMap[color].replace('VAR', '0.1')} 0%, transparent 50%)`,
            }}
            animate={{
              '--x': ['0%', '100%', '0%'],
              '--y': ['0%', '100%', '0%'],
            } as any}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </div>
    );
  }

  // Default: lines
  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage: `
          linear-gradient(${gridColor} 1px, transparent 1px),
          linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }}
    />
  );
}

// Scanline effect overlay
export function ScanlineOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden opacity-[0.02]',
        className
      )}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.1) 2px,
            rgba(255, 255, 255, 0.1) 4px
          )`,
        }}
        animate={{ y: [0, 4] }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

// Noise texture overlay
export function NoiseOverlay({ 
  opacity = 0.02, 
  className 
}: { 
  opacity?: number; 
  className?: string;
}) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Combined background component
export function CyberBackground({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <GridBackground variant="lines" opacity={0.03} />
      <NoiseOverlay opacity={0.015} />
    </div>
  );
}
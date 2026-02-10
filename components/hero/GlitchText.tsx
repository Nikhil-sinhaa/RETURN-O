'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchIntensity?: 'low' | 'medium' | 'high';
}

export function GlitchText({
  text,
  className,
  glitchIntensity = 'medium',
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  const intensityConfig = {
    low: { interval: 5000, duration: 150 },
    medium: { interval: 3000, duration: 200 },
    high: { interval: 1500, duration: 300 },
  };

  const config = intensityConfig[glitchIntensity];

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), config.duration);
    }, config.interval);

    return () => clearInterval(glitchInterval);
  }, [config]);

  return (
    <span className={cn('relative inline-block', className)}>
      {/* Main text */}
      <span
        className="relative z-10 bg-gradient-to-r from-neon-pink via-electric-purple to-neon-cyan bg-clip-text text-transparent"
        style={{
          textShadow: '0 0 80px rgba(255, 0, 110, 0.5)',
        }}
      >
        {text}
      </span>

      {/* Glitch layers */}
      {isGlitching && (
        <>
          {/* Red/Pink glitch layer */}
          <motion.span
            className="absolute inset-0 z-20 text-neon-pink"
            initial={{ x: 0, opacity: 0 }}
            animate={{
              x: [0, -5, 3, -2, 5, 0],
              opacity: [0, 1, 1, 1, 1, 0],
            }}
            transition={{ duration: 0.2 }}
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}
            aria-hidden
          >
            {text}
          </motion.span>

          {/* Cyan glitch layer */}
          <motion.span
            className="absolute inset-0 z-20 text-neon-cyan"
            initial={{ x: 0, opacity: 0 }}
            animate={{
              x: [0, 4, -3, 2, -4, 0],
              opacity: [0, 1, 1, 1, 1, 0],
            }}
            transition={{ duration: 0.2 }}
            style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}
            aria-hidden
          >
            {text}
          </motion.span>

          {/* Scanline effect */}
          <motion.span
            className="absolute inset-0 z-30 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.15 }}
            aria-hidden
          >
            <span
              className="absolute inset-0"
              style={{
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0, 0, 0, 0.3) 2px,
                  rgba(0, 0, 0, 0.3) 4px
                )`,
              }}
            />
          </motion.span>
        </>
      )}

      {/* Permanent subtle glitch effect on hover */}
      <style jsx>{`
        span:hover {
          animation: subtle-glitch 0.3s ease-in-out;
        }

        @keyframes subtle-glitch {
          0%, 100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
        }
      `}</style>
    </span>
  );
}

// Simpler glitch text for smaller elements
export function SimpleGlitchText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'relative inline-block',
        'before:absolute before:left-[2px] before:top-0 before:z-[-1] before:content-[attr(data-text)]',
        'before:text-neon-pink before:opacity-0 before:animate-glitch-1',
        'after:absolute after:left-[-2px] after:top-0 after:z-[-1] after:content-[attr(data-text)]',
        'after:text-neon-cyan after:opacity-0 after:animate-glitch-2',
        className
      )}
      data-text={text}
    >
      {text}
    </span>
  );
}
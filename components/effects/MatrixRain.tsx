'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatrixRainProps {
  isActive: boolean;
  onClose?: () => void;
}

interface Drop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  opacity: number;
}

const MATRIX_CHARS = 'RETURN0;アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
const RETURN0_TEXT = 'RETURN 0;';

export function MatrixRain({ isActive, onClose }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const dropsRef = useRef<Drop[]>([]);

  const getRandomChar = useCallback(() => {
    return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] ?? '0';
  }, []);

  const initDrops = useCallback((width: number, height: number) => {
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops: Drop[] = [];

    for (let i = 0; i < columns; i++) {
      const charCount = Math.floor(Math.random() * 15) + 5;
      const chars: string[] = [];

      for (let j = 0; j < charCount; j++) {
        chars.push(getRandomChar());
      }

      drops.push({
        x: i * fontSize,
        y: Math.random() * height * -1,
        speed: Math.random() * 3 + 2,
        chars,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    dropsRef.current = drops;
  }, [getRandomChar]);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const fontSize = 16;

    // Semi-transparent black to create trail effect
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, width, height);

    dropsRef.current.forEach((drop, index) => {
      // Randomly change characters
      if (Math.random() > 0.95) {
        const charIndex = Math.floor(Math.random() * drop.chars.length);
        drop.chars[charIndex] = getRandomChar() as string;
      }

      // Draw each character in the drop
      drop.chars.forEach((char, charIndex) => {
        const y = drop.y + charIndex * fontSize;

        if (y > 0 && y < height) {
          const isFirst = charIndex === 0;
          const isLast = charIndex === drop.chars.length - 1;

          if (isFirst) {
            // Bright head of the rain
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = '#00F5FF';
            ctx.shadowBlur = 15;
          } else if (isLast) {
            // Fading tail
            ctx.fillStyle = `rgba(0, 245, 255, ${0.1})`;
            ctx.shadowBlur = 0;
          } else {
            // Body - gradient from cyan to purple
            const progress = charIndex / drop.chars.length;
            const r = Math.floor(157 * progress);
            const g = Math.floor(78 + (245 - 78) * (1 - progress));
            const b = Math.floor(221 + (255 - 221) * (1 - progress));
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${drop.opacity * (1 - progress * 0.5)})`;
            ctx.shadowBlur = 0;
          }

          ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
          ctx.fillText(char, drop.x, y);
        }
      });

      // Move drop down
      drop.y += drop.speed;

      // Reset drop when it goes off screen
      if (drop.y - drop.chars.length * fontSize > height) {
        dropsRef.current[index] = {
          ...drop,
          y: -drop.chars.length * fontSize,
          speed: Math.random() * 3 + 2,
          opacity: Math.random() * 0.5 + 0.5,
        };
      }
    });

    // Draw "RETURN 0;" text in center
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.save();
    ctx.font = 'bold 72px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Glowing effect
    ctx.shadowColor = '#FF006E';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#FF006E';
    ctx.fillText(RETURN0_TEXT, centerX, centerY);

    ctx.shadowColor = '#9D4EDD';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#9D4EDD';
    ctx.fillText(RETURN0_TEXT, centerX + 2, centerY + 2);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(RETURN0_TEXT, centerX, centerY);

    ctx.restore();
  }, [getRandomChar]);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDrops(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initial fill
    ctx.fillStyle = '#0A0A0F';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const animate = () => {
      draw(ctx, canvas.width, canvas.height);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, initDrops, draw]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[10000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <canvas
            ref={canvasRef}
            className="h-full w-full"
            onClick={onClose}
          />

          {/* Close button */}
          <motion.button
            className="absolute right-8 top-8 rounded-full border border-neon-pink/50 bg-background/80 px-6 py-3 font-mono text-neon-pink backdrop-blur-sm transition-all hover:bg-neon-pink hover:text-background"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={onClose}
          >
            ESC to exit
          </motion.button>

          {/* Instructions */}
          <motion.p
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-sm text-neon-cyan/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            You found the secret! Click anywhere to close.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
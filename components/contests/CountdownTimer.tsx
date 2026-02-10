'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: string;
  compact?: boolean;
  inline?: boolean;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
}

export function CountdownTimer({
  targetDate,
  compact = false,
  inline = false,
  onComplete,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate)
  );
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0 && !hasCompleted) {
        setHasCompleted(true);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete, hasCompleted]);

  const isUrgent = timeLeft.total > 0 && timeLeft.total < 1000 * 60 * 60; // Less than 1 hour

  if (inline) {
    if (timeLeft.total <= 0) {
      return <span className="font-mono text-green-500">Started!</span>;
    }

    const parts = [];
    if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
    if (timeLeft.hours > 0 || timeLeft.days > 0) parts.push(`${timeLeft.hours}h`);
    parts.push(`${timeLeft.minutes}m`);
    parts.push(`${timeLeft.seconds}s`);

    return (
      <span className={cn('font-mono', isUrgent && 'text-neon-pink')}>
        {parts.join(' ')}
      </span>
    );
  }

  if (compact) {
    if (timeLeft.total <= 0) {
      return (
        <div className="font-mono text-sm text-green-500">Started!</div>
      );
    }

    return (
      <div className={cn('font-mono text-sm', isUrgent && 'text-neon-pink')}>
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>
    );
  }

  if (timeLeft.total <= 0) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center font-mono text-lg font-bold text-green-500"
      >
        🎉 Contest Started!
      </motion.div>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ].filter((unit, index) => {
    // Always show hours, mins, secs. Only show days if > 0
    if (index === 0) return timeLeft.days > 0;
    return true;
  });

  return (
    <div className="flex justify-center gap-2">
      {timeUnits.map((unit, _index) => (
        <div key={unit.label} className="text-center">
          <div
            className={cn(
              'relative overflow-hidden rounded-lg border bg-white/5 px-3 py-2 font-mono text-xl font-bold',
              isUrgent
                ? 'border-neon-pink/50 text-neon-pink'
                : 'border-white/10 text-white'
            )}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={unit.value}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                {String(unit.value).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>

            {/* Glow effect for urgent */}
            {isUrgent && (
              <motion.div
                className="absolute inset-0 bg-neon-pink/20"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
          <span className="mt-1 block text-[10px] uppercase tracking-wider text-white/40">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// Simple countdown for use in other components
export function SimpleCountdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.total <= 0) {
    return <span className="text-green-500">Live!</span>;
  }

  return (
    <span className="font-mono">
      {timeLeft.days > 0 && `${timeLeft.days}d `}
      {String(timeLeft.hours).padStart(2, '0')}:
      {String(timeLeft.minutes).padStart(2, '0')}:
      {String(timeLeft.seconds).padStart(2, '0')}
    </span>
  );
}
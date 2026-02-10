'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function NeonCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const trailSpringConfig = { damping: 35, stiffness: 200, mass: 0.8 };
  const trailXSpring = useSpring(cursorX, trailSpringConfig);
  const trailYSpring = useSpring(cursorY, trailSpringConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    setIsVisible(true);
  }, [cursorX, cursorY]);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsClicking(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsClicking(false);
  }, []);

  useEffect(() => {
    if (isMobile || isReducedMotion) return;

    const checkPointer = () => {
      const hoveredElement = document.elementFromPoint(
        cursorX.get(),
        cursorY.get()
      );
      if (hoveredElement) {
        const computedStyle = window.getComputedStyle(hoveredElement);
        setIsPointer(
          computedStyle.cursor === 'pointer' ||
          hoveredElement.tagName === 'A' ||
          hoveredElement.tagName === 'BUTTON' ||
          hoveredElement.closest('a') !== null ||
          hoveredElement.closest('button') !== null
        );
      }
    };

    const intervalId = setInterval(checkPointer, 100);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, [isMobile, isReducedMotion, cursorX, cursorY, handleMouseMove, handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp]);

  if (isMobile || isReducedMotion) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: isClicking ? 0.8 : isPointer ? 1.5 : 1,
          }}
          transition={{ duration: 0.15 }}
        >
          {/* Core */}
          <div className="h-3 w-3 rounded-full bg-white" />

          {/* Inner glow */}
          <div
            className="absolute inset-0 h-3 w-3 rounded-full blur-[2px]"
            style={{
              background: 'linear-gradient(135deg, #FF006E, #9D4EDD)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Trail ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{
          x: trailXSpring,
          y: trailYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: isClicking ? 0.9 : isPointer ? 1.8 : 1,
            rotate: isPointer ? 45 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Outer ring */}
          <div
            className="h-10 w-10 rounded-full border-2 opacity-60"
            style={{
              borderColor: isPointer ? '#FF006E' : '#00F5FF',
              boxShadow: `0 0 20px ${isPointer ? '#FF006E' : '#00F5FF'}40`,
            }}
          />

          {/* Rotating accent */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
              style={{
                background: '#FFEA00',
                boxShadow: '0 0 10px #FFEA00',
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Pointer mode extra effects */}
      {isPointer && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[9997]"
          style={{
            x: trailXSpring,
            y: trailYSpring,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          {/* Pulsing ring */}
          <motion.div
            className="h-16 w-16 rounded-full border opacity-30"
            style={{ borderColor: '#9D4EDD' }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      )}
    </>
  );
}
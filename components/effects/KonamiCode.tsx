'use client';

import { useState, useEffect, useCallback } from 'react';
import { MatrixRain } from './MatrixRain';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];

export function KonamiCode() {
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);

  const checkSequence = useCallback((sequence: string[]) => {
    const currentLength = sequence.length;
    const expectedSequence = KONAMI_CODE.slice(0, currentLength);
    
    // Check if current sequence matches expected
    const isMatch = sequence.every((key, index) => key === expectedSequence[index]);
    
    if (!isMatch) {
      // Reset if wrong key
      return [];
    }
    
    if (currentLength === KONAMI_CODE.length) {
      // Complete! Activate matrix
      setIsMatrixActive(true);
      return [];
    }
    
    return sequence;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Close matrix on Escape
      if (e.code === 'Escape' && isMatrixActive) {
        setIsMatrixActive(false);
        return;
      }

      setInputSequence((prev) => {
        const newSequence = [...prev, e.code];
        
        // Only keep last N keys where N is length of konami code
        const trimmedSequence = newSequence.slice(-KONAMI_CODE.length);
        
        return checkSequence(trimmedSequence);
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMatrixActive, checkSequence]);

  // Show hint after 30 seconds on page
  useEffect(() => {
    const hintTimer = setTimeout(() => {
      setShowHint(true);
    }, 30000);

    const hideHintTimer = setTimeout(() => {
      setShowHint(false);
    }, 35000);

    return () => {
      clearTimeout(hintTimer);
      clearTimeout(hideHintTimer);
    };
  }, []);

  // Visual feedback for progress
  const progress = inputSequence.length;
  const showProgress = progress > 2 && progress < KONAMI_CODE.length;

  return (
    <>
      {/* Progress indicator - subtle hint when they're on the right track */}
      {showProgress && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="flex items-center gap-1 rounded-full bg-background/80 px-3 py-2 backdrop-blur-sm">
            {KONAMI_CODE.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index < progress
                    ? 'bg-neon-cyan shadow-[0_0_10px_#00F5FF]'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Subtle hint */}
      {showHint && !isMatrixActive && (
        <div className="fixed bottom-4 left-4 z-50 animate-pulse">
          <p className="font-mono text-xs text-white/30">
            ↑↑↓↓←→←→BA
          </p>
        </div>
      )}

      {/* Matrix Rain Effect */}
      <MatrixRain
        isActive={isMatrixActive}
        onClose={() => setIsMatrixActive(false)}
      />
    </>
  );
}
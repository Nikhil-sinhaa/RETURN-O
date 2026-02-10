// hooks/useKonamiCode.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

const KONAMI_CODE: string[] = [
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

interface UseKonamiCodeReturn {
  activated: boolean;
  reset: () => void;
  progress: number;
}

export function useKonamiCode(): UseKonamiCodeReturn {
  const [keys, setKeys] = useState<string[]>([]);
  const [activated, setActivated] = useState<boolean>(false);

  const reset = useCallback(() => {
    setKeys([]);
    setActivated(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      setKeys((prevKeys) => {
        const newKeys = [...prevKeys, event.code].slice(-KONAMI_CODE.length);

        // Check if Konami code is complete
        if (
          newKeys.length === KONAMI_CODE.length &&
          newKeys.every((key, index) => key === KONAMI_CODE[index])
        ) {
          setActivated(true);
          return [];
        }

        // Reset if wrong key pressed
        const currentIndex = newKeys.length - 1;
        if (newKeys[currentIndex] !== KONAMI_CODE[currentIndex]) {
          // Check if it could be the start of a new sequence
          if (event.code === KONAMI_CODE[0]) {
            return [event.code];
          }
          return [];
        }

        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const progress = Math.round((keys.length / KONAMI_CODE.length) * 100);

  return { activated, reset, progress };
}

export default useKonamiCode;
// hooks/useMounted.ts
'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to check if component is mounted (client-side)
 * Useful for avoiding hydration mismatches
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export default useMounted;
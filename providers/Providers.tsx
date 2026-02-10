'use client';

import { ReactNode } from 'react';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import { ThemeProvider } from './ThemeProvider';
import { ToastProvider } from './ToastProvider';
import { NeonCursor } from '@/components/effects/NeonCursor';
import { KonamiCode } from '@/components/effects/KonamiCode';
import { ClientOnly } from '@/components/shared/ClientOnly';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <SmoothScrollProvider>
        {children}
        
        {/* Global effects - client only */}
        <ClientOnly>
          <NeonCursor />
          <KonamiCode />
        </ClientOnly>
        
        {/* Toast notifications */}
        <ToastProvider />
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}
// components/ui/separator.tsx
// Separator/divider component

'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';

interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  variant?: 'default' | 'gradient' | 'neon' | 'dashed';
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = 'horizontal',
      decorative = true,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: 'bg-white/10',
      gradient:
        'bg-gradient-to-r from-transparent via-electric-purple/50 to-transparent',
      neon: 'bg-gradient-to-r from-neon-pink via-electric-purple to-neon-cyan',
      dashed: 'border-dashed border-white/20 bg-transparent',
    };

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          'shrink-0',
          orientation === 'horizontal'
            ? 'h-[1px] w-full'
            : 'h-full w-[1px]',
          variant === 'dashed'
            ? orientation === 'horizontal'
              ? 'border-t'
              : 'border-l'
            : variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

// Decorative separator with text
function SeparatorWithText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Separator variant="gradient" className="flex-1" />
      <span className="text-sm text-white/60 whitespace-nowrap">{children}</span>
      <Separator variant="gradient" className="flex-1" />
    </div>
  );
}

export { Separator, SeparatorWithText };
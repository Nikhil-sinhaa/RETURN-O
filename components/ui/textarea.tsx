// components/ui/textarea.tsx
// Textarea component with neon styling

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  'flex min-h-[120px] w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-white transition-all duration-300 placeholder:text-white/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none',
  {
    variants: {
      variant: {
        default:
          'border-white/20 bg-glass backdrop-blur-sm focus:border-electric-purple focus:ring-2 focus:ring-electric-purple/20',
        neon:
          'border-neon-pink/30 bg-glass backdrop-blur-sm focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/20 focus:shadow-lg focus:shadow-neon-pink/10',
        ghost:
          'border-transparent bg-white/5 focus:bg-white/10 focus:border-white/20',
        outline:
          'border-2 border-white/30 bg-transparent focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20',
        error:
          'border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: string;
  showCount?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, error, showCount, maxLength, value, ...props }, ref) => {
    const actualVariant = error ? 'error' : variant;
    const characterCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="relative">
        <textarea
          className={cn(textareaVariants({ variant: actualVariant, className }))}
          ref={ref}
          value={value}
          maxLength={maxLength}
          {...props}
        />
        {showCount && maxLength && (
          <div
            className={cn(
              'absolute bottom-3 right-3 text-xs',
              characterCount >= maxLength ? 'text-red-500' : 'text-white/40'
            )}
          >
            {characterCount}/{maxLength}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
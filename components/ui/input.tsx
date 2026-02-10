// components/ui/input.tsx
// Input component with neon styling

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-white transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-white/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
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
        success:
          'border-green-500 bg-green-500/5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
      },
      inputSize: {
        default: 'h-11',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-5 text-base',
        xl: 'h-14 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, variant, inputSize, leftIcon, rightIcon, error, ...props },
    ref
  ) => {
    const hasIcon = leftIcon || rightIcon;
    const actualVariant = error ? 'error' : variant;

    if (hasIcon) {
      return (
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: actualVariant, inputSize, className }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10'
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(inputVariants({ variant: actualVariant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
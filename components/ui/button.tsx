// components/ui/button.tsx
// Button component with multiple variants

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-neon-pink to-electric-purple text-white hover:opacity-90 hover:shadow-lg hover:shadow-neon-pink/25 active:scale-[0.98]',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/25',
        outline:
          'border-2 border-electric-purple bg-transparent text-electric-purple hover:bg-electric-purple/10 hover:border-neon-pink hover:text-neon-pink',
        secondary:
          'bg-glass border border-white/10 text-white hover:bg-white/10 hover:border-white/20',
        ghost:
          'text-white/70 hover:text-white hover:bg-white/5',
        link:
          'text-neon-cyan underline-offset-4 hover:underline hover:text-neon-pink',
        neon:
          'relative bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-lg hover:shadow-neon-cyan/25 before:absolute before:inset-0 before:bg-neon-cyan/20 before:blur-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        glow:
          'bg-gradient-to-r from-neon-pink via-electric-purple to-neon-cyan text-white animate-gradient-x hover:shadow-xl hover:shadow-electric-purple/30',
        cyber:
          'bg-cyber-yellow text-background font-bold hover:bg-cyber-yellow/90 hover:shadow-lg hover:shadow-cyber-yellow/30',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 rounded-md px-4 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    // When using asChild, Slot expects exactly ONE child element
    // leftIcon and rightIcon won't work with asChild - user must handle manually
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={disabled || isLoading}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    // Normal button rendering
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
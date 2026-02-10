// components/ui/card.tsx
// Card component with glass morphism effect

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-2xl transition-all duration-300',
  {
    variants: {
      variant: {
        default:
          'bg-glass border border-white/10 backdrop-blur-xl',
        elevated:
          'bg-glass border border-white/10 backdrop-blur-xl shadow-xl shadow-black/20',
        outline:
          'bg-transparent border-2 border-white/20',
        ghost:
          'bg-transparent',
        neon:
          'bg-glass border border-neon-pink/30 backdrop-blur-xl hover:border-neon-pink/60 hover:shadow-lg hover:shadow-neon-pink/10',
        gradient:
          'bg-gradient-to-br from-neon-pink/10 via-electric-purple/10 to-neon-cyan/10 border border-white/10 backdrop-blur-xl',
        glow:
          'bg-glass border border-electric-purple/30 backdrop-blur-xl relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-neon-pink/20 before:via-electric-purple/20 before:to-neon-cyan/20 before:blur-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity before:-z-10',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30',
        scale: 'hover:scale-[1.02]',
        glow: 'hover:shadow-lg hover:shadow-electric-purple/20',
        border: 'hover:border-electric-purple/50',
      },
    },
    defaultVariants: {
      variant: 'default',
      hover: 'none',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, hover, className }))}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-bold leading-none tracking-tight text-white',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-white/60', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
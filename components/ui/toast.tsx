// components/ui/toast.tsx
// Toast notification component

'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Toast as ToastType } from './use-toast';

interface ToastProps extends ToastType {
  onDismiss: (id: string) => void;
}

const variantStyles = {
  default: {
    container: 'border-white/20',
    icon: null,
    iconColor: 'text-white',
  },
  success: {
    container: 'border-green-500/30',
    icon: CheckCircle2,
    iconColor: 'text-green-500',
  },
  error: {
    container: 'border-red-500/30',
    icon: XCircle,
    iconColor: 'text-red-500',
  },
  warning: {
    container: 'border-cyber-yellow/30',
    icon: AlertTriangle,
    iconColor: 'text-cyber-yellow',
  },
  info: {
    container: 'border-neon-cyan/30',
    icon: Info,
    iconColor: 'text-neon-cyan',
  },
};

export function Toast({
  id,
  title,
  description,
  variant = 'default',
  action,
  onDismiss,
}: ToastProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'pointer-events-auto relative flex w-full items-start gap-4 overflow-hidden rounded-xl border bg-glass p-4 backdrop-blur-xl shadow-lg',
        styles.container
      )}
    >
      {/* Icon */}
      {Icon && (
        <div className={cn('flex-shrink-0 mt-0.5', styles.iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 space-y-1">
        {title && (
          <p className="text-sm font-semibold text-white">{title}</p>
        )}
        {description && (
          <p className="text-sm text-white/70">{description}</p>
        )}
        {action && <div className="mt-2">{action}</div>}
      </div>

      {/* Close button */}
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 rounded-lg p-1 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: 'linear' }}
        className={cn(
          'absolute bottom-0 left-0 right-0 h-0.5 origin-left',
          variant === 'success' && 'bg-green-500',
          variant === 'error' && 'bg-red-500',
          variant === 'warning' && 'bg-cyber-yellow',
          variant === 'info' && 'bg-neon-cyan',
          variant === 'default' && 'bg-electric-purple'
        )}
      />
    </motion.div>
  );
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
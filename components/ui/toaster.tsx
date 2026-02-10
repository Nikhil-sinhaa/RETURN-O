// components/ui/toaster.tsx
// Toaster provider component

'use client';

import { useToast } from './use-toast';
import { ToastContainer } from './toast';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return <ToastContainer toasts={toasts} onDismiss={dismiss} />;
}
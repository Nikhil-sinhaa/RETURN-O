'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  MessageSquare,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/effects/GlassCard';
import { cn } from '@/lib/utils';

// Form validation schema
const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject is too long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message is too long'),
  organization: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setStatus('success');
      reset();

      // Reset to idle after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    }
  };

  return (
    <GlassCard className="p-8">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="mb-6 rounded-full bg-green-500/10 p-4"
            >
              <CheckCircle className="h-12 w-12 text-green-500" />
            </motion.div>
            <h3 className="mb-2 text-2xl font-bold text-white">
              Message Sent!
            </h3>
            <p className="text-white/60">
              Thank you for reaching out. We&apos;ll get back to you soon.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Error message */}
            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 rounded-lg bg-red-500/10 px-4 py-3 text-red-500"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name and Email row */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-medium text-white"
                >
                  <User className="h-4 w-4 text-white/50" />
                  Name <span className="text-neon-pink">*</span>
                </label>
                <Input
                  id="name"
                  placeholder="Your name"
                  {...register('name')}
                  className={cn(errors.name && 'border-red-500')}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium text-white"
                >
                  <Mail className="h-4 w-4 text-white/50" />
                  Email <span className="text-neon-pink">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  {...register('email')}
                  className={cn(errors.email && 'border-red-500')}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Organization (optional) */}
            <div className="space-y-2">
              <label
                htmlFor="organization"
                className="flex items-center gap-2 text-sm font-medium text-white"
              >
                <Building className="h-4 w-4 text-white/50" />
                Organization{' '}
                <span className="text-xs text-white/40">(optional)</span>
              </label>
              <Input
                id="organization"
                placeholder="Your company or institution"
                {...register('organization')}
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="flex items-center gap-2 text-sm font-medium text-white"
              >
                <MessageSquare className="h-4 w-4 text-white/50" />
                Subject <span className="text-neon-pink">*</span>
              </label>
              <Input
                id="subject"
                placeholder="What is this about?"
                {...register('subject')}
                className={cn(errors.subject && 'border-red-500')}
              />
              {errors.subject && (
                <p className="text-xs text-red-500">{errors.subject.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="flex items-center gap-2 text-sm font-medium text-white"
              >
                <MessageSquare className="h-4 w-4 text-white/50" />
                Message <span className="text-neon-pink">*</span>
              </label>
              <Textarea
                id="message"
                placeholder="Your message..."
                rows={6}
                {...register('message')}
                className={cn(errors.message && 'border-red-500')}
              />
              {errors.message && (
                <p className="text-xs text-red-500">{errors.message.message}</p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-gradient-to-r from-neon-pink to-electric-purple py-6 text-lg font-semibold"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </>
              )}
            </Button>

            {/* Privacy note */}
            <p className="text-center text-xs text-white/40">
              By submitting this form, you agree to our privacy policy. We&apos;ll
              never share your information with third parties.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
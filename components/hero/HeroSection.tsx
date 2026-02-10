'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TerminalTyping } from './TerminalTyping';
import { GlitchText } from './GlitchText';
import { ParticleExplosion } from './ParticleExplosion';
import { HeroOrbs } from '@/components/effects/GradientOrb';
import { GridBackground } from '@/components/effects/GridBackground';
import Link from 'next/link';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background pt-20"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <HeroOrbs />
        <GridBackground variant="lines" opacity={0.02} />
      </div>

      {/* Particle explosion effect */}
      <ParticleExplosion />

      {/* Main content */}
      <motion.div
        style={{ opacity, y, scale }}
        className="relative z-10 mx-auto max-w-7xl px-4 text-center md:px-6"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-neon-pink/30 bg-neon-pink/10 px-4 py-2"
        >
          <Zap className="h-4 w-4 text-neon-pink" />
          <span className="text-sm font-medium text-neon-pink">
            Competitive Programming Club
          </span>
          <span className="rounded-full bg-neon-pink px-2 py-0.5 text-xs font-bold text-background">
            IIIT Dharwad
          </span>
        </motion.div>

        {/* Terminal typing effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <TerminalTyping />
        </motion.div>

        {/* Glitch title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
        >
          <GlitchText text="RETURN 0;" />
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-white/60 md:text-xl"
        >
          Where algorithms come alive and code runs flawlessly.
          <span className="block mt-2 text-white/40">
            Join the elite community of problem solvers at IIIT Dharwad.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-neon-pink to-electric-purple px-8 py-6 text-lg font-semibold"
          >
            <Link href="/contests">
              <span className="relative z-10">View Live Contests</span>
              <motion.span
                className="absolute inset-0 bg-white"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
                style={{ opacity: 0.2 }}
              />
              <span className="relative z-10 ml-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/20 px-8 py-6 text-lg hover:border-white/40 hover:bg-white/5"
          >
            <Link href="/team">
              Meet the Team
            </Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {[
            { value: '500+', label: 'Problems Solved' },
            { value: '50+', label: 'Active Members' },
            { value: '20+', label: 'Contest Wins' },
            { value: '100+', label: 'Events Hosted' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <motion.span
                className="block text-3xl font-bold text-white md:text-4xl"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1, type: 'spring' }}
              >
                {stat.value}
              </motion.span>
              <span className="mt-1 block text-sm text-white/50">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-wider text-white/40">
            Scroll to explore
          </span>
          <ArrowDown className="h-5 w-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
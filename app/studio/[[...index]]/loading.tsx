// app/studio/[[...index]]/loading.tsx
'use client';

import { motion } from 'framer-motion';

export default function StudioLoading() {
  return (
    <div className="fixed inset-0 bg-[#0A0A0F] flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 200 200"
            className="mx-auto"
          >
            <defs>
              <linearGradient
                id="studioLogoGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FF006E" />
                <stop offset="50%" stopColor="#9D4EDD" />
                <stop offset="100%" stopColor="#00F5FF" />
              </linearGradient>
              <filter id="studioGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <motion.circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#studioLogoGradient)"
              strokeWidth="4"
              filter="url(#studioGlow)"
              initial={{ pathLength: 0, rotate: 0 }}
              animate={{ pathLength: 1, rotate: 360 }}
              transition={{
                pathLength: { duration: 2, ease: 'easeInOut' },
                rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
              }}
            />

            <motion.text
              x="100"
              y="95"
              textAnchor="middle"
              fill="url(#studioLogoGradient)"
              fontSize="28"
              fontFamily="monospace"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              RETURN
            </motion.text>

            <motion.text
              x="100"
              y="125"
              textAnchor="middle"
              fill="url(#studioLogoGradient)"
              fontSize="32"
              fontFamily="monospace"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              0;
            </motion.text>
          </svg>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg, #FF006E, #9D4EDD, #00F5FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Loading Studio
        </motion.h2>

        {/* Loading Dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #FF006E, #9D4EDD)',
              }}
              initial={{ opacity: 0.3, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 0.15,
              }}
            />
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-gray-400 mt-6 text-sm"
        >
          Initializing content management system...
        </motion.p>
      </div>

      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(157, 78, 221, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(157, 78, 221, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
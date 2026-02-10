'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Mail, 
  MapPin,
  ExternalLink,
  Heart
} from 'lucide-react';

const footerLinks = {
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'Contests', href: '/contests' },
    { label: 'Events', href: '/events' },
    { label: 'Team', href: '/team' },
  ],
  resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Achievements', href: '/achievements' },
    { label: 'Contact', href: '/contact' },
    { label: 'Codeforces', href: 'https://codeforces.com', external: true },
  ],
  platforms: [
    { label: 'LeetCode', href: 'https://leetcode.com' },
    { label: 'CodeChef', href: 'https://codechef.com' },
    { label: 'AtCoder', href: 'https://atcoder.jp' },
    { label: 'HackerRank', href: 'https://hackerrank.com' },
  ],
};

const socialLinks = [
  { icon: Github, href: 'https://github.com/return0-iiitdwd', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/company/return0-iiitdwd', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/return0.iiitdwd', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/return0_iiitdwd', label: 'Twitter' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/10 bg-background">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-neon-pink/5 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-electric-purple/5 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6">
        {/* Main footer content */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-12 w-12">
                <Image
                  src="/logo.svg"
                  alt="RETURN 0; Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-mono text-xl font-bold text-white">
                  RETURN <span className="text-neon-pink">0</span>;
                </span>
                <span className="block text-sm text-white/50">
                  Competitive Programming Club
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-white/60">
              Empowering students to excel in competitive programming through practice, 
              collaboration, and continuous learning at IIIT Dharwad.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <a
                href="mailto:return0@iiitdwd.ac.in"
                className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-neon-pink"
              >
                <Mail className="h-4 w-4" />
                return0@iiitdwd.ac.in
              </a>
              <div className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                  IIIT Dharwad, Ittigatti Road,<br />
                  Near Sattur Colony, Dharwad,<br />
                  Karnataka - 580009
                </span>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-neon-pink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-neon-pink"
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-neon-pink"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="font-semibold text-white">Platforms</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.platforms.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-neon-pink"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-center text-sm text-white/40">
            © {currentYear} RETURN 0; — IIIT Dharwad. All rights reserved.
          </p>
          
          <p className="flex items-center gap-1 text-sm text-white/40">
            Made with{' '}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="h-4 w-4 fill-neon-pink text-neon-pink" />
            </motion.span>{' '}
            by RETURN 0; Team
          </p>
        </div>
      </div>
    </footer>
  );
}
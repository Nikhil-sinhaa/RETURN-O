'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Trophy, 
  Calendar, 
  Users, 
  BookOpen, 
  Award, 
  Mail,
  Github,
  Linkedin,
  Instagram,
  ExternalLink
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  currentPath: string;
}

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="h-5 w-5" />,
  Contests: <Trophy className="h-5 w-5" />,
  Events: <Calendar className="h-5 w-5" />,
  Team: <Users className="h-5 w-5" />,
  Blog: <BookOpen className="h-5 w-5" />,
  Achievements: <Award className="h-5 w-5" />,
  Contact: <Mail className="h-5 w-5" />,
};

const socialLinks = [
  { icon: <Github className="h-5 w-5" />, href: 'https://github.com/return0-iiitdwd', label: 'GitHub' },
  { icon: <Linkedin className="h-5 w-5" />, href: 'https://linkedin.com/company/return0-iiitdwd', label: 'LinkedIn' },
  { icon: <Instagram className="h-5 w-5" />, href: 'https://instagram.com/return0.iiitdwd', label: 'Instagram' },
];

const menuVariants = {
  closed: {
    opacity: 0,
    x: '100%',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: 20 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

export function MobileMenu({ isOpen, onClose, items, currentPath }: MobileMenuProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-y-0 right-0 z-40 w-full max-w-sm border-l border-white/10 bg-background p-6 lg:hidden"
          >
            {/* Navigation Links */}
            <nav className="mt-16 space-y-2">
              {items.map((item, i) => {
                const isActive = currentPath === item.href ||
                  (item.href !== '/' && currentPath.startsWith(item.href));

                return (
                  <motion.div
                    key={item.href}
                    custom={i}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-4 rounded-xl px-4 py-3 text-lg font-medium transition-all',
                        isActive
                          ? 'bg-gradient-to-r from-neon-pink/20 to-electric-purple/20 text-white'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <span className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg',
                        isActive
                          ? 'bg-neon-pink/20 text-neon-pink'
                          : 'bg-white/5 text-white/60'
                      )}>
                        {iconMap[item.label]}
                      </span>
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="mobile-nav-indicator"
                          className="ml-auto h-2 w-2 rounded-full bg-neon-pink"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* CTA Button */}
            <motion.div
              custom={items.length}
              variants={itemVariants}
              initial="closed"
              animate="open"
              className="mt-8"
            >
              <Button
                asChild
                className="w-full bg-gradient-to-r from-neon-pink to-electric-purple py-6 text-lg"
              >
                <Link href="/contests" onClick={onClose}>
                  View Live Contests
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              custom={items.length + 1}
              variants={itemVariants}
              initial="closed"
              animate="open"
              className="mt-8 border-t border-white/10 pt-8"
            >
              <p className="mb-4 text-sm text-white/40">Follow us</p>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              custom={items.length + 2}
              variants={itemVariants}
              initial="closed"
              animate="open"
              className="absolute bottom-6 left-6 right-6"
            >
              <p className="text-center text-xs text-white/30">
                © 2025 RETURN 0; • IIIT Dharwad
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
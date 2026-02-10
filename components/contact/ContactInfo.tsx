'use client';

import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  Clock,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  ExternalLink,
} from 'lucide-react';
import { GlassCard } from '@/components/effects/GlassCard';

const contactDetails = [
  {
    icon: Mail,
    label: 'Email',
    value: 'return0@iiitdwd.ac.in',
    href: 'mailto:return0@iiitdwd.ac.in',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'IIIT Dharwad, Karnataka, India',
    href: 'https://maps.google.com/?q=IIIT+Dharwad',
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: 'Within 24-48 hours',
  },
];

const socialLinks = [
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/return0-iiitdwd',
    color: 'hover:text-white',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/return0-iiitdwd',
    color: 'hover:text-[#0A66C2]',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://instagram.com/return0.iiitdwd',
    color: 'hover:text-[#E4405F]',
  },
  {
    icon: Twitter,
    label: 'Twitter',
    href: 'https://twitter.com/return0_iiitdwd',
    color: 'hover:text-[#1DA1F2]',
  },
];

export function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Contact Details */}
      <GlassCard className="p-6">
        <h3 className="mb-6 text-lg font-semibold text-white">
          Contact Information
        </h3>
        <div className="space-y-4">
          {contactDetails.map((detail, index) => (
            <motion.div
              key={detail.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {detail.href ? (
                <a
                  href={detail.href}
                  target={detail.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    detail.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="group flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-white/5"
                >
                  <div className="rounded-lg bg-neon-pink/10 p-2.5">
                    <detail.icon className="h-5 w-5 text-neon-pink" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/50">{detail.label}</p>
                    <p className="font-medium text-white group-hover:text-neon-pink">
                      {detail.value}
                    </p>
                  </div>
                  {detail.href.startsWith('http') && (
                    <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-neon-pink" />
                  )}
                </a>
              ) : (
                <div className="flex items-start gap-4 p-3">
                  <div className="rounded-lg bg-neon-pink/10 p-2.5">
                    <detail.icon className="h-5 w-5 text-neon-pink" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">{detail.label}</p>
                    <p className="font-medium text-white">{detail.value}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Social Links */}
      <GlassCard className="p-6">
        <h3 className="mb-6 text-lg font-semibold text-white">Follow Us</h3>
        <div className="grid grid-cols-2 gap-4">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 rounded-lg bg-white/5 p-4 text-white/60 transition-all hover:bg-white/10 ${social.color}`}
            >
              <social.icon className="h-5 w-5" />
              <span className="font-medium">{social.label}</span>
            </motion.a>
          ))}
        </div>
      </GlassCard>

      {/* FAQ Teaser */}
      <GlassCard className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3 text-sm text-white/60">
          <p>
            <span className="font-medium text-white">How can I join RETURN 0;?</span>
            <br />
            Any IIIT Dharwad student can join! Attend our events and stay active
            on our Discord.
          </p>
          <p>
            <span className="font-medium text-white">
              Do I need prior CP experience?
            </span>
            <br />
            No! We welcome beginners and provide resources to help you start.
          </p>
          <p>
            <span className="font-medium text-white">
              How often do you conduct events?
            </span>
            <br />
            We host weekly practice sessions and monthly contests.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
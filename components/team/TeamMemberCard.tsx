'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
} from 'lucide-react';
import { GlassCard } from '@/components/effects/GlassCard';
import { LiveRating } from './LiveRating';
import { cn } from '@/lib/utils';
import urlForImage from '@/lib/sanity.image';
import type { TeamMember } from '@/lib/types';

interface TeamMemberCardProps {
  member: TeamMember;
  featured?: boolean;
}

export function TeamMemberCard({ member, featured = false }: TeamMemberCardProps) {
  const [imageError, setImageError] = useState(false);

  const getRoleColor = (role: string) => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes('president') || lowerRole.includes('lead')) {
      return 'from-neon-pink to-electric-purple';
    }
    if (lowerRole.includes('head') || lowerRole.includes('coordinator')) {
      return 'from-electric-purple to-neon-cyan';
    }
    if (lowerRole.includes('core')) {
      return 'from-neon-cyan to-cyber-yellow';
    }
    return 'from-white/20 to-white/10';
  };

  const socialLinks = [
    member.github && { icon: Github, href: member.github, label: 'GitHub' },
    member.linkedin && { icon: Linkedin, href: member.linkedin, label: 'LinkedIn' },
    member.twitter && { icon: Twitter, href: member.twitter, label: 'Twitter' },
    member.email && { icon: Mail, href: `mailto:${member.email}`, label: 'Email' },
  ].filter(Boolean) as { icon: typeof Github; href: string; label: string }[];

  return (
    <GlassCard
      hover="glow"
      glowColor={featured ? 'pink' : 'purple'}
      className={cn(
        'group relative overflow-hidden',
        featured ? 'p-8' : 'p-6'
      )}
    >
      {/* Role badge */}
      <div
        className={cn(
          'absolute right-0 top-0 rounded-bl-xl bg-gradient-to-r px-3 py-1 text-xs font-medium text-white',
          getRoleColor(member.role)
        )}
      >
        {member.role}
      </div>

      {/* Profile section */}
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <div
            className={cn(
              'relative overflow-hidden rounded-full border-2 transition-all duration-300 group-hover:scale-105',
              featured
                ? 'h-32 w-32 border-neon-pink/50'
                : 'h-24 w-24 border-white/20 group-hover:border-neon-pink/50'
            )}
          >
            {member.image && !imageError ? (
              <Image
                src={urlForImage(member.image).url()}
                alt={member.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neon-pink/20 to-electric-purple/20">
                <span className="text-3xl font-bold text-white/60">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              </div>
            )}
          </div>

          {/* Online indicator for featured */}
          {featured && (
            <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
          )}
        </div>

        {/* Name */}
        <h3
          className={cn(
            'font-semibold text-white transition-colors group-hover:text-neon-pink',
            featured ? 'text-xl' : 'text-lg'
          )}
        >
          {member.name}
        </h3>

        {/* Year */}
        {member.year && (
          <p className="mt-1 text-sm text-white/40">
            {member.year}
          </p>
        )}

        {/* Bio */}
        {member.bio && (
          <p className="mt-3 line-clamp-2 text-sm text-white/60">
            {member.bio}
          </p>
        )}

        {/* Competitive Programming Handles */}
        {(member.codeforcesHandle || member.codechefHandle) && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {member.codeforcesHandle && (
              <LiveRating
                platform="codeforces"
                handle={member.codeforcesHandle}
              />
            )}
            {member.codechefHandle && (
              <LiveRating
                platform="codechef"
                handle={member.codechefHandle}
              />
            )}
          </div>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="mt-4 flex justify-center gap-2">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={link.label}
              >
                <link.icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neon-pink/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </GlassCard>
  );
}
'use client';

import { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy, Medal, Link2, Users, Calendar, Award } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import urlForImage from '@/lib/sanity.image';
import type { Achievement, TeamMember } from '@/lib/types';

type MedalLevel = 'gold' | 'silver' | 'bronze' | 'special';

const MEDAL_CONFIG: Record<
  MedalLevel,
  { icon: typeof Trophy; label: string; className: string }
> = {
  gold: {
    icon: Trophy,
    label: 'Gold',
    className: 'bg-yellow-400/20 text-yellow-200 border-yellow-400/40',
  },
  silver: {
    icon: Medal,
    label: 'Silver',
    className: 'bg-slate-200/10 text-slate-100 border-slate-300/40',
  },
  bronze: {
    icon: Medal,
    label: 'Bronze',
    className: 'bg-amber-700/30 text-amber-100 border-amber-500/50',
  },
  special: {
    icon: Award,
    label: 'Special',
    className: 'bg-purple-500/20 text-purple-100 border-purple-400/40',
  },
};

// Derive a medal level from rank / rankTitle
function getMedalLevel(achievement: Achievement): MedalLevel | null {
  if (achievement.rankTitle) {
    const t = achievement.rankTitle.toLowerCase();
    if (t.includes('gold') || t.includes('1st') || t.includes('first')) return 'gold';
    if (t.includes('silver') || t.includes('2nd') || t.includes('second')) return 'silver';
    if (t.includes('bronze') || t.includes('3rd') || t.includes('third')) return 'bronze';
    if (t.includes('special') || t.includes('honorable') || t.includes('honourable')) {
      return 'special';
    }
  }

  if (achievement.rank != null) {
    if (achievement.rank === 1) return 'gold';
    if (achievement.rank === 2) return 'silver';
    if (achievement.rank === 3) return 'bronze';
  }

  return null;
}

const PLATFORM_LABELS: Record<
  NonNullable<Achievement['platform']>,
  string
> = {
  codeforces: 'Codeforces',
  codechef: 'CodeChef',
  leetcode: 'LeetCode',
  atcoder: 'AtCoder',
  hackerrank: 'HackerRank',
  hackerearth: 'HackerEarth',
  icpc: 'ICPC',
  other: 'Other',
};

const PLATFORM_CLASSES: Partial<Record<NonNullable<Achievement['platform']>, string>> = {
  codeforces: 'bg-[#1f8acb]/20 text-[#1f8acb]',
  codechef: 'bg-[#5b4638]/20 text-[#f5deb3]',
  leetcode: 'bg-[#ffa116]/20 text-[#ffa116]',
  atcoder: 'bg-black/40 text-white',
  hackerrank: 'bg-[#2ec866]/20 text-[#2ec866]',
  hackerearth: 'bg-[#323754]/20 text-[#9fa3ff]',
  icpc: 'bg-blue-600/20 text-blue-300',
  other: 'bg-white/10 text-white/70',
};

interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
}

function AchievementCardComponent({ achievement, className }: AchievementCardProps) {
  const medalLevel = getMedalLevel(achievement);
  const MedalIcon = medalLevel ? MEDAL_CONFIG[medalLevel].icon : null;

  const imageUrl =
    achievement.image ? urlForImage(achievement.image).url() : null;

  const platformLabel =
    achievement.platform && PLATFORM_LABELS[achievement.platform];
  const platformClass =
    achievement.platform && PLATFORM_CLASSES[achievement.platform];

  const members = achievement.members ?? [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      <Card
        className={cn(
          'group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl',
          'transition-all duration-300 hover:border-neon-pink/60 hover:shadow-[0_0_40px_rgba(255,0,110,0.35)]',
          className
        )}
      >
        {/* Top image / medal area */}
        <div className="relative h-40 w-full overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={achievement.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-neon-pink/30 via-electric-purple/30 to-neon-cyan/30">
              <Trophy className="h-10 w-10 text-white/60" />
            </div>
          )}

          {/* Medal badge */}
          {medalLevel && MedalIcon && (
            <div className="absolute left-3 top-3">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
                  'backdrop-blur-md',
                  MEDAL_CONFIG[medalLevel].className
                )}
              >
                <MedalIcon className="h-4 w-4" />
                <span>
                  {achievement.rankTitle ??
                    MEDAL_CONFIG[medalLevel].label}
                  {achievement.rank != null ? ` #${achievement.rank}` : ''}
                </span>
              </div>
            </div>
          )}

          {/* Platform badge */}
          {platformLabel && (
            <div className="absolute right-3 top-3">
              <Badge
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md',
                  platformClass
                )}
              >
                {platformLabel}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          {/* Title & contest name */}
          <div className="space-y-1">
            <h3 className="line-clamp-2 text-lg font-semibold text-white">
              {achievement.title}
            </h3>
            {achievement.contestName && (
              <p className="text-sm text-white/60">
                {achievement.contestName}
              </p>
            )}
          </div>

          {/* Date & category */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
            {achievement.date && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(achievement.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span className="capitalize">
              {achievement.category === 'individual'
                ? 'Individual'
                : achievement.category === 'team'
                  ? 'Team'
                  : 'Club'}
            </span>
            {achievement.featured && (
              <>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span className="rounded-full bg-neon-pink/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neon-pink">
                  Featured
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {achievement.description && (
            <p className="line-clamp-3 text-sm text-white/70">
              {achievement.description}
            </p>
          )}

          {/* Members */}
          {members.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-xs font-medium text-white/70">
                <Users className="h-3.5 w-3.5" />
                <span>Members</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {members.map((member: TeamMember, i: number) => (
                  <span
                    key={member._id ?? i}
                    className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/70"
                  >
                    {member.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Proof link */}
          {achievement.proofLink && (
            <div className="pt-1">
              <a
                href={achievement.proofLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-neon-cyan hover:text-neon-pink"
              >
                <Link2 className="h-3.5 w-3.5" />
                <span>View Proof / Link</span>
              </a>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export const AchievementCard = memo(AchievementCardComponent);
export default AchievementCard;

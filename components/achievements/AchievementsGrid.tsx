'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trophy, Medal, Star, Award } from 'lucide-react';
import AchievementCard from './AchievementCard';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Achievement, TeamMember } from '@/lib/types';

interface AchievementsGridProps {
  achievements: Achievement[];
  showSearch?: boolean;
  showFilters?: boolean;
  showStats?: boolean;
  limit?: number;
}

type AchievementFilter = 'all' | 'gold' | 'silver' | 'bronze' | 'special';

const filterConfig: { value: AchievementFilter; label: string; icon: typeof Trophy }[] = [
  { value: 'all', label: 'All', icon: Award },
  { value: 'gold', label: 'Gold', icon: Trophy },
  { value: 'silver', label: 'Silver', icon: Medal },
  { value: 'bronze', label: 'Bronze', icon: Medal },
  { value: 'special', label: 'Special', icon: Star },
];

export function AchievementsGrid({
  achievements,
  showSearch = true,
  showFilters = true,
  showStats = true,
  limit,
}: AchievementsGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<AchievementFilter>('all');

  // derive medal from rank / rankTitle
  const isMedal = (a: Achievement, medal: AchievementFilter) => {
    const t = a.rankTitle?.toLowerCase() ?? '';

    switch (medal) {
      case 'gold':
        return a.rank === 1 || t.includes('gold');
      case 'silver':
        return a.rank === 2 || t.includes('silver');
      case 'bronze':
        return a.rank === 3 || t.includes('bronze');
      case 'special':
        return t.includes('special');
      default:
        return true;
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    const gold = achievements.filter((a) => isMedal(a, 'gold')).length;
    const silver = achievements.filter((a) => isMedal(a, 'silver')).length;
    const bronze = achievements.filter((a) => isMedal(a, 'bronze')).length;
    const special = achievements.filter((a) => isMedal(a, 'special')).length;

    return { gold, silver, bronze, special, total: achievements.length };
  }, [achievements]);

  const filteredAchievements = useMemo(() => {
    let filtered = achievements;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((a) => {
        if (a.title.toLowerCase().includes(query)) return true;
        if (a.description?.toLowerCase().includes(query)) return true;
        if (a.platform?.toLowerCase().includes(query)) return true;

        // search members (TeamMember[])
        if (a.members?.some((m: TeamMember) =>
          m.name?.toLowerCase().includes(query)
        )) return true;

        return false;
      });
    }

    // Apply medal filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter((a) => isMedal(a, activeFilter));
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [achievements, searchQuery, activeFilter, limit]);

  return (
    <div className="space-y-8">
      {/* Stats */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-5"
        >
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <Award className="mx-auto mb-2 h-6 w-6 text-white/60" />
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-white/50">Total</p>
          </div>
          <div className="rounded-xl border border-cyber-yellow/20 bg-cyber-yellow/5 p-4 text-center">
            <Trophy className="mx-auto mb-2 h-6 w-6 text-cyber-yellow" />
            <p className="text-2xl font-bold text-cyber-yellow">{stats.gold}</p>
            <p className="text-xs text-white/50">Gold</p>
          </div>
          <div className="rounded-xl border border-gray-400/20 bg-gray-400/5 p-4 text-center">
            <Medal className="mx-auto mb-2 h-6 w-6 text-gray-400" />
            <p className="text-2xl font-bold text-gray-400">{stats.silver}</p>
            <p className="text-xs text-white/50">Silver</p>
          </div>
          <div className="rounded-xl border border-orange-600/20 bg-orange-600/5 p-4 text-center">
            <Medal className="mx-auto mb-2 h-6 w-6 text-orange-600" />
            <p className="text-2xl font-bold text-orange-600">{stats.bronze}</p>
            <p className="text-xs text-white/50">Bronze</p>
          </div>
          <div className="rounded-xl border border-neon-pink/20 bg-neon-pink/5 p-4 text-center">
            <Star className="mx-auto mb-2 h-6 w-6 text-neon-pink" />
            <p className="text-2xl font-bold text-neon-pink">{stats.special}</p>
            <p className="text-xs text-white/50">Special</p>
          </div>
        </motion.div>
      )}

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          {showSearch && (
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                type="text"
                placeholder="Search achievements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-2">
              {filterConfig.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
                    activeFilter === filter.value
                      ? 'bg-gradient-to-r from-neon-pink to-electric-purple text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <filter.icon className="h-4 w-4" />
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {filteredAchievements.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-white/10 bg-white/5 p-12 text-center"
        >
          <Trophy className="mx-auto mb-4 h-12 w-12 text-white/30" />
          <h3 className="mb-2 text-lg font-semibold text-white">
            No achievements found
          </h3>
          <p className="text-white/60">
            {searchQuery
              ? `No achievements matching "${searchQuery}"`
              : 'No achievements in this category yet.'}
          </p>
        </motion.div>
      ) : (
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement._id || achievement.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <AchievementCard achievement={achievement} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

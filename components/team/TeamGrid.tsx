'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users } from 'lucide-react';
import { TeamMemberCard } from './TeamMemberCard';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { TeamMember } from '@/lib/types';

interface TeamGridProps {
  members: TeamMember[];
  showSearch?: boolean;
  showFilters?: boolean;
  featured?: boolean;
}

type RoleFilter = 'all' | 'lead' | 'core' | 'member';

const roleFilters: { value: RoleFilter; label: string }[] = [
  { value: 'all', label: 'All Members' },
  { value: 'lead', label: 'Leads' },
  { value: 'core', label: 'Core Team' },
  { value: 'member', label: 'Members' },
];

export function TeamGrid({
  members,
  showSearch = true,
  showFilters = true,
}: TeamGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  const filteredMembers = useMemo(() => {
    let filtered = members;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query) ||
          member.bio?.toLowerCase().includes(query) ||
          member.codeforcesHandle?.toLowerCase().includes(query) ||
          member.codechefHandle?.toLowerCase().includes(query)
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((member) => {
        const role = member.role.toLowerCase();
        switch (roleFilter) {
          case 'lead':
            return role.includes('lead') || role.includes('president') || role.includes('head');
          case 'core':
            return role.includes('core') || role.includes('coordinator') || role.includes('secretary');
          case 'member':
            return !role.includes('lead') && !role.includes('president') && !role.includes('head') && !role.includes('core');
          default:
            return true;
        }
      });
    }

    // Sort by role priority
    const rolePriority: Record<string, number> = {
      president: 1,
      lead: 2,
      head: 3,
      coordinator: 4,
      core: 5,
      secretary: 6,
      member: 10,
    };

    filtered.sort((a, b) => {
      const aRole = a.role.toLowerCase();
      const bRole = b.role.toLowerCase();

      const aPriority = Object.entries(rolePriority).find(([key]) => aRole.includes(key))?.[1] || 10;
      const bPriority = Object.entries(rolePriority).find(([key]) => bRole.includes(key))?.[1] || 10;

      return aPriority - bPriority;
    });

    return filtered;
  }, [members, searchQuery, roleFilter]);

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          {showSearch && (
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* Role Filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-2">
              {roleFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setRoleFilter(filter.value)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-all',
                    roleFilter === filter.value
                      ? 'bg-gradient-to-r from-neon-pink to-electric-purple text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-white/40">
        <Users className="h-4 w-4" />
        <span>
          {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
      </div>

      {/* Team Grid */}
      {filteredMembers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-white/10 bg-white/5 p-12 text-center"
        >
          <Users className="mx-auto mb-4 h-12 w-12 text-white/30" />
          <h3 className="mb-2 text-lg font-semibold text-white">
            No members found
          </h3>
          <p className="text-white/60">
            Try adjusting your search or filter criteria.
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member._id || member.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <TeamMemberCard member={member} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
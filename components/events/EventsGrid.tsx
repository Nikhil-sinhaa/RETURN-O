'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar } from 'lucide-react';
import { EventCard } from './EventCard';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Event } from '@/lib/types';

interface EventsGridProps {
  events: Event[];
  showSearch?: boolean;
  showFilters?: boolean;
  limit?: number;
  isPast?: boolean; // 👈 added
}

type EventFilter = 'all' | 'upcoming' | 'past' | 'workshop' | 'contest' | 'meetup';

const eventFilters: { value: EventFilter; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
  { value: 'workshop', label: 'Workshops' },
  { value: 'contest', label: 'Contests' },
  { value: 'meetup', label: 'Meetups' },
];

export function EventsGrid({
  events,
  showSearch = true,
  showFilters = true,
  limit,
  isPast: _isPast, // 👈 added
}: EventsGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<EventFilter>('all');

  const filteredEvents = useMemo(() => {
    let filtered = events;
    const now = new Date();

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    switch (activeFilter) {
      case 'upcoming':
        filtered = filtered.filter((event) => new Date(event.date || '') >= now);
        break;
      case 'past':
        filtered = filtered.filter((event) => new Date(event.date || '') < now);
        break;
      case 'workshop':
      case 'contest':
      case 'meetup':
        filtered = filtered.filter(
          (event) => event.type?.toLowerCase() === activeFilter
        );
        break;
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.date || '');
      const dateB = new Date(b.date || '');
      const isAUpcoming = dateA >= now;
      const isBUpcoming = dateB >= now;

      if (isAUpcoming && !isBUpcoming) return -1;
      if (!isAUpcoming && isBUpcoming) return 1;
      if (isAUpcoming && isBUpcoming) return dateA.getTime() - dateB.getTime();
      return dateB.getTime() - dateA.getTime();
    });

    if (limit) filtered = filtered.slice(0, limit);
    return filtered;
  }, [events, searchQuery, activeFilter, limit]);

  const upcomingCount = useMemo(() => {
    const now = new Date();
    return events.filter((e) => new Date(e.date || '') >= now).length;
  }, [events]);

  return (
    <div className="space-y-8">
      {(showSearch || showFilters) && (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {showSearch && (
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {showFilters && (
            <div className="flex flex-wrap gap-2">
              {eventFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-all',
                    activeFilter === filter.value
                      ? 'bg-gradient-to-r from-neon-pink to-electric-purple text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {filter.label}
                  {filter.value === 'upcoming' && upcomingCount > 0 && (
                    <span className="ml-1.5 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                      {upcomingCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {filteredEvents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-white/10 bg-white/5 p-12 text-center"
        >
          <Calendar className="mx-auto mb-4 h-12 w-12 text-white/30" />
          <h3 className="mb-2 text-lg font-semibold text-white">
            No events found
          </h3>
          <p className="text-white/60">
            {searchQuery
              ? `No events matching "${searchQuery}"`
              : 'No events in this category yet.'}
          </p>
        </motion.div>
      ) : (
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event._id || (typeof event.slug === 'string' ? event.slug : event.slug?.current)}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {/* 👇 forward prop */}
                <EventCard event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
{/* End of EventsGrid component */ }
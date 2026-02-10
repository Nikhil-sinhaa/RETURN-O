'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { GlassCard } from '@/components/effects/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Event } from '@/lib/types';

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

type EventStatus = 'upcoming' | 'ongoing' | 'past';

const typeColors: Record<string, string> = {
  workshop: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
  contest: 'bg-neon-pink/10 text-neon-pink border-neon-pink/30',
  meetup: 'bg-electric-purple/10 text-electric-purple border-electric-purple/30',
  hackathon: 'bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/30',
  webinar: 'bg-green-500/10 text-green-500 border-green-500/30',
  default: 'bg-white/10 text-white/60 border-white/20',
};

export function EventCard({ event, featured = false }: EventCardProps) {
  const status: EventStatus = useMemo(() => {
    if (!event.date) return 'upcoming';
    const now = new Date();
    const eventDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : eventDate;

    if (now < eventDate) return 'upcoming';
    if (now >= eventDate && now <= endDate) return 'ongoing';
    return 'past';
  }, [event.date, event.endDate]);

  const statusConfig = {
    upcoming: {
      label: 'Upcoming',
      color: 'bg-cyber-yellow/10 text-cyber-yellow',
    },
    ongoing: {
      label: 'Happening Now',
      color: 'bg-green-500/10 text-green-500',
    },
    past: {
      label: 'Past Event',
      color: 'bg-white/10 text-white/40',
    },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const typeColor = event.type
    ? typeColors[event.type.toLowerCase()] || typeColors.default
    : typeColors.default;

  return (
    <GlassCard
      hover="glow"
      glowColor={status === 'ongoing' ? 'cyan' : 'purple'}
      className={cn(
        'group flex h-full flex-col overflow-hidden',
        featured && 'md:col-span-2 md:flex-row'
      )}
    >
      {/* Image */}
      {event.image && (
        <div
          className={cn(
            'relative overflow-hidden',
            featured ? 'h-64 md:h-auto md:w-1/2' : 'h-48'
          )}
        >
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Status badge */}
          <div className="absolute left-4 top-4">
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                statusConfig[status].color
              )}
            >
              {status === 'ongoing' && (
                <span className="relative mr-1.5 inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
              )}
              {statusConfig[status].label}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={cn('flex flex-1 flex-col p-6', featured && 'md:w-1/2')}>
        {/* Type badge */}
        {event.type && (
          <div className="mb-3">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
                typeColor
              )}
            >
              <Tag className="h-3 w-3" />
              {event.type}
            </span>
          </div>
        )}

        {/* Title */}
        <h3
          className={cn(
            'mb-3 font-semibold text-white transition-colors group-hover:text-neon-pink',
            featured ? 'text-2xl' : 'text-lg'
          )}
        >
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p
            className={cn(
              'mb-4 text-white/60',
              featured ? 'line-clamp-3' : 'line-clamp-2',
              'text-sm'
            )}
          >
            {event.description}
          </p>
        )}

        {/* Meta info */}
        <div className="mb-4 flex-1 space-y-2 text-sm text-white/50">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{event.date ? formatDate(event.date) : 'TBA'}</span>
          </div>

          {event.time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}

          {event.attendees && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{event.attendees} attendees</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {event.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {event.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{event.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex gap-3">
          <Button asChild className="flex-1" variant="outline">
            <Link href={`/events/${event.slug}`}>
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          {event.registrationUrl && status === 'upcoming' && (
            <Button
              asChild
              className="bg-gradient-to-r from-neon-pink to-electric-purple"
            >
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Register
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
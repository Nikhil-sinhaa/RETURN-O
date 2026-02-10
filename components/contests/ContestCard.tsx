'use client';

import { useState, useMemo } from 'react';
import {
  ExternalLink,
  Clock,
  Calendar,
  Timer,
  Bell,
  BellOff,
  CheckCircle
} from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { PlatformBadge } from './PlatformBadge';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/effects/GlassCard';
import { cn } from '@/lib/utils';
import type { Contest } from '@/hooks/useContests';

interface ContestCardProps {
  contest: Contest;
  compact?: boolean;
}

type ContestStatus = 'upcoming' | 'ongoing' | 'ended';

export function ContestCard({ contest, compact = false }: ContestCardProps) {
  const [isReminderSet, setIsReminderSet] = useState(false);

  const status: ContestStatus = useMemo(() => {
    const now = new Date();
    const start = new Date(contest.start_time);
    const end = new Date(contest.end_time);

    if (now < start) return 'upcoming';
    if (now >= start && now < end) return 'ongoing';
    return 'ended';
  }, [contest.start_time, contest.end_time]);

  const statusConfig = {
    upcoming: {
      label: 'Upcoming',
      color: 'text-cyber-yellow',
      bgColor: 'bg-cyber-yellow/10',
      borderColor: 'border-cyber-yellow/30',
      icon: Calendar,
    },
    ongoing: {
      label: 'Live Now',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      icon: Timer,
    },
    ended: {
      label: 'Ended',
      color: 'text-white/40',
      bgColor: 'bg-white/5',
      borderColor: 'border-white/10',
      icon: CheckCircle,
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    }

    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSetReminder = () => {
    // In a real app, this would set up a notification
    setIsReminderSet(!isReminderSet);

    // You could also add to calendar
    if (!isReminderSet) {
      const startDate = new Date(contest.start_time);
      const endDate = new Date(contest.end_time);

      // Create Google Calendar URL
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(contest.name)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(`Contest on ${contest.site}\n${contest.url}`)}&location=${encodeURIComponent(contest.url)}`;

      window.open(gcalUrl, '_blank');
    }
  };

  if (compact) {
    return (
      <GlassCard
        hover="glow"
        glowColor={status === 'ongoing' ? 'cyan' : 'purple'}
        className="group p-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <PlatformBadge platform={contest.site} size="sm" />
              <span className={cn('text-xs font-medium', config.color)}>
                {config.label}
              </span>
            </div>

            <h3 className="mb-2 truncate font-semibold text-white">
              {contest.name}
            </h3>

            {status === 'upcoming' && (
              <CountdownTimer targetDate={contest.start_time} compact />
            )}

            {status === 'ongoing' && (
              <p className="text-sm text-green-500">
                Ends in <CountdownTimer targetDate={contest.end_time} inline />
              </p>
            )}
          </div>

          <Button
            asChild
            size="sm"
            className="shrink-0 bg-gradient-to-r from-neon-pink to-electric-purple"
          >
            <a href={contest.url} target="_blank" rel="noopener noreferrer">
              Join
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard
      hover="glow"
      glowColor={status === 'ongoing' ? 'cyan' : 'purple'}
      className="group flex h-full flex-col p-6"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <PlatformBadge platform={contest.site} showLabel />

        <div
          className={cn(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
            config.bgColor,
            config.color
          )}
        >
          {status === 'ongoing' && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
          )}
          <StatusIcon className="h-3 w-3" />
          {config.label}
        </div>
      </div>

      {/* Title */}
      <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-white group-hover:text-neon-pink transition-colors">
        {contest.name}
      </h3>

      {/* Details */}
      <div className="mb-4 flex-1 space-y-2 text-sm text-white/60">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-white/40" />
          <span>{formatDate(contest.start_time)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-white/40" />
          <span>Duration: {formatDuration(typeof contest.duration === 'number' ? contest.duration : parseInt(contest.duration))}</span>
        </div>
      </div>

      {/* Countdown */}
      {status === 'upcoming' && (
        <div className="mb-4">
          <p className="mb-2 text-xs text-white/40">Starts in</p>
          <CountdownTimer targetDate={contest.start_time} />
        </div>
      )}

      {status === 'ongoing' && (
        <div className="mb-4">
          <p className="mb-2 text-xs text-white/40">Ends in</p>
          <CountdownTimer targetDate={contest.end_time} />
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto flex gap-2">
        <Button
          asChild
          className="flex-1 bg-gradient-to-r from-neon-pink to-electric-purple"
        >
          <a href={contest.url} target="_blank" rel="noopener noreferrer">
            {status === 'ongoing' ? 'Join Now' : 'Register'}
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>

        {status === 'upcoming' && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleSetReminder}
            className={cn(
              'border-white/10',
              isReminderSet && 'border-cyber-yellow/50 text-cyber-yellow'
            )}
            title={isReminderSet ? 'Reminder set' : 'Set reminder'}
          >
            {isReminderSet ? (
              <Bell className="h-4 w-4 fill-current" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </GlassCard>
  );
}
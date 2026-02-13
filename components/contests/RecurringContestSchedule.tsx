'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Repeat, ExternalLink } from 'lucide-react';
import { PLATFORM_SCHEDULES } from '@/lib/platform-schedules';
import { cn } from '@/lib/utils';

export function RecurringContestSchedule() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PLATFORM_SCHEDULES.map((platform, index) => (
                    <motion.div
                        key={platform.platform}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Link
                            href={platform.contestUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block h-full"
                        >
                            <div
                                className={cn(
                                    'group relative h-full rounded-xl border border-white/10 bg-white/5 p-6',
                                    'backdrop-blur-xl transition-all duration-300',
                                    'hover:border-white/20 hover:bg-white/10 hover:shadow-lg'
                                )}
                                style={{
                                    '--platform-color': platform.color,
                                } as React.CSSProperties}
                            >
                                {/* Hover glow effect */}
                                <div
                                    className="absolute inset-0 -z-10 rounded-xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20"
                                    style={{ backgroundColor: platform.color }}
                                />

                                {/* Header */}
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white"
                                            style={{ backgroundColor: platform.color }}
                                        >
                                            {platform.displayName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">
                                                {platform.displayName}
                                            </h3>
                                            <p className="text-xs text-white/40">
                                                {platform.recurringContests.length} recurring contests
                                            </p>
                                        </div>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-white/40 transition-colors group-hover:text-white/60" />
                                </div>

                                {/* Contests list */}
                                <div className="space-y-3">
                                    {platform.recurringContests.map((contest, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-lg bg-white/5 p-3 transition-colors group-hover:bg-white/10"
                                        >
                                            <h4 className="mb-2 text-sm font-medium text-white">
                                                {contest.name}
                                            </h4>
                                            <div className="space-y-1 text-xs text-white/60">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{contest.day}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{contest.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Repeat className="h-3 w-3" />
                                                    <span>{contest.frequency}</span>
                                                </div>
                                            </div>
                                            {contest.description && (
                                                <p className="mt-2 text-xs text-white/40">
                                                    {contest.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Visit platform link indicator */}
                                <div className="mt-4 flex items-center gap-2 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100"
                                    style={{ color: platform.color }}
                                >
                                    <span>Visit {platform.displayName}</span>
                                    <ExternalLink className="h-3 w-3" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Info note */}
            <p className="text-center text-xs text-white/40">
                Click on any platform to view their official contest page
            </p>
        </div>
    );
}

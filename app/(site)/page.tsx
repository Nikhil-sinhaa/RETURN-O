// app/(site)/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Trophy, Zap } from "lucide-react";

// Use DEFAULT imports (not named imports)
import { HeroSection } from "@/components/hero/HeroSection";
import SectionHeader from "@/components/shared/SectionHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { LiveContests } from "@/components/contests/LiveContests";
import { GridBackground } from "@/components/effects/GridBackground";
import { GradientOrb } from "@/components/effects/GradientOrb";
import { EventCard } from "@/components/events/EventCard";
import { AchievementCard } from "@/components/achievements/AchievementCard";

import { Button } from "@/components/ui/button";
import { getSiteSettings, getUpcomingEvents, getFeaturedAchievements } from "@/lib/sanity.fetch";

export const metadata: Metadata = {
  title: "RETURN 0; | Competitive Programming Club - IIIT Dharwad",
  description:
    "The Official Competitive Programming Club of IIIT Dharwad. We solve problems, break barriers, and build champions.",
};

// Events Section Component
async function UpcomingEventsSection() {
  const events = await getUpcomingEvents();

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No upcoming events at the moment.</p>
        <p className="text-gray-500 text-sm mt-2">Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.slice(0, 3).map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}

// Achievements Section Component
async function FeaturedAchievementsSection() {
  const achievements = await getFeaturedAchievements();

  if (!achievements || achievements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Achievements coming soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.slice(0, 3).map((achievement) => (
        <AchievementCard key={achievement._id} achievement={achievement} />
      ))}
    </div>
  );
}

export default async function HomePage() {
  await getSiteSettings();

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <GridBackground />
      <GradientOrb
        color="pink"
        size="xl"
        className="fixed -top-40 -right-40 opacity-20"
      />
      <GradientOrb
        color="purple"
        size="lg"
        className="fixed top-1/2 -left-40 opacity-20"
      />
      <GradientOrb
        color="cyan"
        size="md"
        className="fixed bottom-20 right-1/4 opacity-15"
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Live Contests Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <SectionHeader
              title="Live Contests"
              subtitle="Never miss a competitive programming contest. Auto-updated every 60 seconds."
              className="mb-6 md:mb-0"
            />
            <Link href="/contests">
              <Button
                variant="outline"
                className="group border-[#00F5FF]/50 hover:border-[#00F5FF] hover:bg-[#00F5FF]/10"
              >
                View All Contests
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <Suspense
            fallback={
              <div className="flex justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            }
          >
            <LiveContests limit={6} showFilters={false} />
          </Suspense>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 relative z-10 bg-gradient-to-b from-transparent via-[#FF006E]/5 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div className="flex items-center gap-4 mb-6 md:mb-0">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#FF006E]/20 to-[#9D4EDD]/20 border border-[#FF006E]/30">
                <Calendar className="w-6 h-6 text-[#FF006E]" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Upcoming Events
                </h2>
                <p className="text-gray-400 mt-1">
                  Workshops, contests, and more
                </p>
              </div>
            </div>
            <Link href="/events">
              <Button
                variant="outline"
                className="group border-[#FF006E]/50 hover:border-[#FF006E] hover:bg-[#FF006E]/10"
              >
                View All Events
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <Suspense
            fallback={
              <div className="flex justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            }
          >
            <UpcomingEventsSection />
          </Suspense>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div className="flex items-center gap-4 mb-6 md:mb-0">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFEA00]/20 to-[#FF006E]/20 border border-[#FFEA00]/30">
                <Trophy className="w-6 h-6 text-[#FFEA00]" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Our Achievements
                </h2>
                <p className="text-gray-400 mt-1">
                  Celebrating excellence in competitive programming
                </p>
              </div>
            </div>
            <Link href="/achievements">
              <Button
                variant="outline"
                className="group border-[#FFEA00]/50 hover:border-[#FFEA00] hover:bg-[#FFEA00]/10"
              >
                View All Achievements
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <Suspense
            fallback={
              <div className="flex justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            }
          >
            <FeaturedAchievementsSection />
          </Suspense>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF006E]/20 via-[#9D4EDD]/20 to-[#00F5FF]/20" />
            <div className="absolute inset-0 bg-[#0A0A0F]/80 backdrop-blur-xl" />

            {/* Content */}
            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00F5FF]/10 border border-[#00F5FF]/30 mb-6">
                <Zap className="w-4 h-4 text-[#00F5FF]" />
                <span className="text-sm text-[#00F5FF] font-medium">
                  Join the Community
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#FF006E] via-[#9D4EDD] to-[#00F5FF] bg-clip-text text-transparent">
                  Ready to Level Up?
                </span>
              </h2>

              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                Join RETURN 0; and be part of IIIT Dharwad&apos;s most passionate
                competitive programming community. Learn, compete, and grow with us.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/team">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#FF006E] to-[#9D4EDD] hover:shadow-[0_0_30px_rgba(255,0,110,0.5)] px-8 py-6 text-lg font-semibold"
                  >
                    Meet the Team
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 hover:border-white/40 hover:bg-white/5 px-8 py-6 text-lg font-semibold"
                  >
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
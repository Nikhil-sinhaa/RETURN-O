// app/(site)/events/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllEvents } from '@/lib/sanity.fetch';
import { EventsGrid } from '@/components/events/EventsGrid';
import SectionHeader from '@/components/shared/SectionHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { GradientOrb } from '@/components/effects/GradientOrb';
import { GridBackground } from '@/components/effects/GridBackground';
import { Calendar, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Events | RETURN 0; - IIIT Dharwad',
  description: 'Explore our upcoming and past events including workshops, contests, hackathons, and more.',
};

async function EventsContent() {
  const events = await getAllEvents();

  const now = new Date();
  const upcomingEvents = events?.filter(e => e.date && new Date(e.date) >= now) || [];
  const pastEvents = events?.filter(e => e.date && new Date(e.date) < now) || [];

  return (
    <>
      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="mb-24">
          <SectionHeader
            title="Upcoming Events"
            subtitle="Don't miss out on these exciting events"
            icon={<Clock className="w-6 h-6" />}
          />
          <EventsGrid events={upcomingEvents} />
        </section>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section>
          <SectionHeader
            title="Past Events"
            subtitle="Take a look at what we've accomplished"
            icon={<Calendar className="w-6 h-6" />}
          />
          <EventsGrid events={pastEvents} isPast />
        </section>
      )}

      {/* No Events */}
      {(!events || events.length === 0) && (
        <div className="text-center py-20">
          <div className="text-6xl mb-6">📅</div>
          <h3 className="text-2xl font-semibold text-white mb-4">No Events Yet</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            We're planning some exciting events. Check back soon or follow us on social media for updates!
          </p>
        </div>
      )}
    </>
  );
}

export default function EventsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 relative">
      <GridBackground />

      {/* Decorative orbs */}
      <GradientOrb
        color1="#843cbfff"
        color2="#FF006E"
        className="absolute right-0 top-20 w-[500px] h-[500px] opacity-20"
      />
      <GradientOrb
        color1="#00F5FF"
        color2="#FFEA00"
        className="absolute left-0 bottom-40 w-[400px] h-[400px] opacity-20"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9D4EDD]/20 border border-[#9D4EDD]/50 mb-6">
            <Calendar className="w-4 h-4 text-[#9D4EDD]" />
            <span className="text-sm text-[#9D4EDD]">Our Events</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#FF006E] via-[#9D4EDD] to-[#00F5FF] bg-clip-text text-transparent">
              Events & Workshops
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From workshops and coding contests to hackathons and guest lectures,
            we organize events that help you grow as a programmer.
          </p>
        </div>

        {/* Event Types */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {[
            { icon: '🏆', label: 'Contests', color: '#FF006E' },
            { icon: '📚', label: 'Workshops', color: '#9D4EDD' },
            { icon: '💻', label: 'Hackathons', color: '#00F5FF' },
            { icon: '🎤', label: 'Guest Talks', color: '#FFEA00' },
          ].map((type) => (
            <div
              key={type.label}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[rgba(18,18,26,0.75)] backdrop-blur-xl border border-white/10 hover:border-opacity-50 transition-all duration-300 cursor-default"
              style={{ '--hover-color': type.color } as React.CSSProperties}
            >
              <span className="text-xl">{type.icon}</span>
              <span className="text-gray-300">{type.label}</span>
            </div>
          ))}
        </div>

        {/* Events Content */}
        <Suspense fallback={<LoadingSpinner />}>
          <EventsContent />
        </Suspense>
      </div>
    </main>
  );
}
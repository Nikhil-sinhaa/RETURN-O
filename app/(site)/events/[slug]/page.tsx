// app/(site)/events/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getEventBySlug, getAllEvents } from '@/lib/sanity.fetch';
import urlForImage from '@/lib/sanity.image';
import PortableTextRenderer from '@/components/blog/PortableTextRenderer';
import { GradientOrb } from '@/components/effects/GradientOrb';
import { GridBackground } from '@/components/effects/GridBackground';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  ExternalLink,
  Share2
} from 'lucide-react';

interface Event {
  title: string;
  eventType: string;
  description?: string;
  date?: string; // Make 'date' optional if it may be missing
  content?: any;
  registrationLink?: string;
  image?: any;
  location?: string;
  // Add other properties as needed
}

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events?.map((event) => ({ slug: typeof event.slug === 'string' ? event.slug : event.slug.current })) || [];
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: 'Event Not Found | RETURN 0;',
    };
  }

  return {
    title: `${event.title} | RETURN 0; - IIIT Dharwad`,
    description: event.description || `Join us for ${event.title}`,
    openGraph: {
      title: event.title,
      description: event.description,
      images: (event as any).image ? [{ url: urlForImage((event as any).image).url() }] : [],
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug) as Event;

  if (!event) {
    notFound();
  }

  const eventDate = event.date ? new Date(event.date) : null;
  const isPast = eventDate ? eventDate < new Date() : false;
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : 'Date not available';
  const formattedTime = eventDate
    ? eventDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
    : 'Time not available';

  const eventTypeColors: Record<string, string> = {
    contest: '#FF006E',
    workshop: '#9D4EDD',
    hackathon: '#00F5FF',
    talk: '#FFEA00',
    meetup: '#00EA64',
  };

  const typeColor = eventTypeColors[event.eventType] || '#9D4EDD';

  return (
    <main className="min-h-screen pt-24 pb-16 relative">
      <GridBackground />

      <GradientOrb
        color1={typeColor}
        color2="#9D4EDD"
        className="absolute right-0 top-20 w-[500px] h-[500px] opacity-20"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Back Button */}
        <Link href="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Event Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge
                className="text-white"
                style={{ backgroundColor: typeColor }}
              >
                {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
              </Badge>
              {isPast && (
                <Badge className="border border-gray-500 text-gray-400 bg-transparent">
                  Past Event
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {event.title}
            </h1>

            {event.description && (
              <p className="text-xl text-gray-400 mb-8">
                {event.description}
              </p>
            )}

            {/* Event Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-xl bg-[rgba(18,18,26,0.75)] backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#9D4EDD]/20">
                  <Calendar className="w-5 h-5 text-[#9D4EDD]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm text-white">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00F5FF]/20">
                  <Clock className="w-5 h-5 text-[#00F5FF]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm text-white">{formattedTime}</p>
                </div>
              </div>

              {(event as any).location && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#FF006E]/20">
                    <MapPin className="w-5 h-5 text-[#FF006E]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm text-white">{(event as any).location as string}</p>
                  </div>
                </div>
              )}

            </div>
          </header>

          {/* Event Image */}
          {(event as any).image && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12">
              <Image
                src={urlForImage((event as any).image).width(1200).height(675).url()}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
            </div>
          )}

          {/* Event Content */}
          {event.content && (
            <div className="prose prose-invert prose-lg max-w-none mb-12">
              <PortableTextRenderer content={event.content} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-8 border-t border-white/10">
            {event.registrationLink && !isPast && (
              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-to-r from-[#FF006E] to-[#9D4EDD] hover:opacity-90">
                  Register Now
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </a>
            )}

            <Button className="border border-white/20 bg-transparent hover:bg-white/10">
              <Share2 className="mr-2 w-4 h-4" />
              Share Event
            </Button>
          </div>
        </article>
      </div>
    </main>
  );
}
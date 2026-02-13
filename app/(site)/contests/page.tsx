// app/(site)/contests/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { LiveContests } from '@/components/contests/LiveContests';
import { RecurringContestSchedule } from '@/components/contests/RecurringContestSchedule';
import SectionHeader from '@/components/shared/SectionHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { GradientOrb } from '@/components/effects/GradientOrb';
import { GridBackground } from '@/components/effects/GridBackground';
import { Code2, Info, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Live Contests | RETURN 0; - IIIT Dharwad',
  description: 'Stay updated with upcoming competitive programming contests from Codeforces, LeetCode, CodeChef, AtCoder, and more.',
};

const platforms = [
  { name: 'Codeforces', color: '#FF006E', description: 'Most popular CP platform' },
  { name: 'LeetCode', color: '#FFEA00', description: 'Interview preparation' },
  { name: 'CodeChef', color: '#9D4EDD', description: 'Long challenges & cook-offs' },
  { name: 'AtCoder', color: '#00F5FF', description: 'High-quality problems' },
  { name: 'HackerRank', color: '#00EA64', description: 'Skill assessments' },
  { name: 'HackerEarth', color: '#2C3454', description: 'Hiring challenges' },
];

export default function ContestsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 relative">
      <GridBackground />

      {/* Decorative orbs */}
      <GradientOrb
        color="pink"
        className="absolute left-0 top-20 w-[500px] h-[500px] opacity-20"
      />
      <GradientOrb
        color="cyan"
        className="absolute right-0 bottom-20 w-[400px] h-[400px] opacity-20"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00F5FF]/20 border border-[#00F5FF]/50 mb-6">
            <Code2 className="w-4 h-4 text-[#00F5FF]" />
            <span className="text-sm text-[#00F5FF]">Real-time Updates</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#FF006E] via-[#9D4EDD] to-[#00F5FF] bg-clip-text text-transparent">
              Competitive Programming Contests
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Track recurring contest schedules and never miss upcoming contests
            from all major platforms in one place.
          </p>
        </div>

        {/* Recurring Contest Schedules Section */}
        <section className="mb-24">
          <SectionHeader
            title="Recurring Contest Schedules"
            subtitle="Know when your favorite platforms hold their contests"
            icon={<Calendar className="w-6 h-6" />}
          />
          <div className="mt-8">
            <RecurringContestSchedule />
          </div>
        </section>

        {/* Platform Legend */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(18,18,26,0.75)] backdrop-blur-xl border border-white/10"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: platform.color }}
                />
                <span className="text-sm text-gray-300">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-12 p-4 rounded-xl bg-[rgba(18,18,26,0.75)] backdrop-blur-xl border border-[#00F5FF]/30 flex items-start gap-4">
          <Info className="w-5 h-5 text-[#00F5FF] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-gray-300 text-sm">
              Contest data is fetched from <strong className="text-[#00F5FF]">KontestAPI</strong> and
              auto-refreshes every 60 seconds. Times are shown in your local timezone.
            </p>
          </div>
        </div>

        {/* Live Contests Grid */}
        <section>
          <SectionHeader
            title="Live & Upcoming Contests"
            subtitle="Real-time contest data from all major platforms"
            icon={<Code2 className="w-6 h-6" />}
          />
          <div className="mt-8">
            <Suspense fallback={<LoadingSpinner />}>
              <LiveContests />
            </Suspense>
          </div>
        </section>

        {/* Tips Section */}
        <section className="mt-24">
          <SectionHeader
            title="Contest Tips"
            subtitle="Maximize your performance in competitive programming contests"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: '⏰',
                title: 'Start on Time',
                description: 'Set reminders 15 minutes before the contest starts to get ready.',
              },
              {
                icon: '📝',
                title: 'Read All Problems First',
                description: 'Quickly scan all problems to identify the easiest ones to start with.',
              },
              {
                icon: '🧪',
                title: 'Test Edge Cases',
                description: 'Always test your solution with edge cases before submitting.',
              },
              {
                icon: '⚡',
                title: 'Optimize Later',
                description: 'Get a working solution first, then optimize if needed.',
              },
              {
                icon: '🔄',
                title: 'Don\'t Get Stuck',
                description: 'If stuck for 15+ minutes, move to another problem.',
              },
              {
                icon: '📊',
                title: 'Analyze After',
                description: 'Review solutions after the contest to learn new techniques.',
              },
            ].map((tip) => (
              <div
                key={tip.title}
                className="p-6 rounded-xl bg-[rgba(18,18,26,0.75)] backdrop-blur-xl border border-white/10 hover:border-[#9D4EDD]/50 transition-all duration-300 group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {tip.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>
                <p className="text-gray-400 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
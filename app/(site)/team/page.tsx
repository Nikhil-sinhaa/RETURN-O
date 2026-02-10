// app/(site)/team/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllTeamMembers } from '@/lib/sanity.fetch';
import { TeamGrid } from '@/components/team/TeamGrid';
import SectionHeader from '@/components/shared/SectionHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { GradientOrb } from '@/components/effects/GradientOrb';
import { GridBackground } from '@/components/effects/GridBackground';
import { Users, Star, Code2, Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Team | RETURN 0; - IIIT Dharwad',
  description: 'Meet the passionate team behind RETURN 0; - Competitive Programming Club of IIIT Dharwad.',
};

async function TeamContent() {
  const members = await getAllTeamMembers();

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-6">👥</div>
        <h3 className="text-2xl font-semibold text-white mb-4">Team Loading...</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Our team information is being updated. Check back soon!
        </p>
      </div>
    );
  }

  // Separate by role
  const leads = members.filter(m => m.role?.toLowerCase().includes('lead') || m.role?.toLowerCase().includes('president'));
  const core = members.filter(m => m.role?.toLowerCase().includes('core') && !leads.includes(m));
  const coordinators = members.filter(m => m.role?.toLowerCase().includes('coordinator') && !leads.includes(m) && !core.includes(m));
  const others = members.filter(m => !leads.includes(m) && !core.includes(m) && !coordinators.includes(m));

  return (
    <div className="space-y-24">
      {/* Club Leads */}
      {leads.length > 0 && (
        <section>
          <SectionHeader
            title="Club Leadership"
            subtitle="Guiding RETURN 0; towards excellence"
            icon={<Star className="w-6 h-6" />}
            align="center"
          />
          <TeamGrid members={leads} featured />
        </section>
      )}

      {/* Core Team */}
      {core.length > 0 && (
        <section>
          <SectionHeader
            title="Core Team"
            subtitle="The backbone of our club operations"
            icon={<Code2 className="w-6 h-6" />}
            align="center"
          />
          <TeamGrid members={core} />
        </section>
      )}

      {/* Coordinators */}
      {coordinators.length > 0 && (
        <section>
          <SectionHeader
            title="Coordinators"
            subtitle="Making things happen on the ground"
            icon={<Users className="w-6 h-6" />}
            align="center"
          />
          <TeamGrid members={coordinators} />
        </section>
      )}

      {/* Other Members */}
      {others.length > 0 && (
        <section>
          <SectionHeader
            title="Team Members"
            subtitle="Our dedicated club members"
            icon={<Trophy className="w-6 h-6" />}
            align="center"
          />
          <TeamGrid members={others} />
        </section>
      )}
    </div>
  );
}

export default function TeamPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 relative">
      <GridBackground />

      {/* Decorative orbs */}
      <GradientOrb
        color1="#FF006E"
        color2="#FFEA00"
        className="absolute left-0 top-40 w-[500px] h-[500px] opacity-20"
      />
      <GradientOrb
        color1="#00F5FF"
        color2="#9D4EDD"
        className="absolute right-0 bottom-40 w-[400px] h-[400px] opacity-20"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF006E]/20 border border-[#FF006E]/50 mb-6">
            <Users className="w-4 h-4 text-[#FF006E]" />
            <span className="text-sm text-[#FF006E]">Meet the Team</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#FF006E] via-[#9D4EDD] to-[#00F5FF] bg-clip-text text-transparent">
              The Minds Behind
            </span>
            <br />
            <span className="text-white">RETURN 0;</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A passionate team of competitive programmers dedicated to fostering
            a culture of algorithmic thinking and problem-solving at IIIT Dharwad.
          </p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { label: 'Team Members', value: '20+', icon: '👥' },
            { label: 'Max CF Rating', value: '2100+', icon: '📈' },
            { label: 'Problems Solved', value: '5000+', icon: '✅' },
            { label: 'Years Active', value: '3+', icon: '🎯' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-xl bg-[rgba(18,18,26,0.75)] backdrop-blur-xl border border-white/10 text-center hover:border-[#9D4EDD]/50 transition-all duration-300"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#FF006E] to-[#00F5FF] bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Team Content */}
        <Suspense fallback={<LoadingSpinner />}>
          <TeamContent />
        </Suspense>

        {/* Join CTA */}
        <section className="mt-24 text-center">
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-[rgba(18,18,26,0.75)] backdrop-blur-xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to Join the Team?
            </h3>
            <p className="text-gray-400 mb-6">
              We're always looking for passionate coders to join RETURN 0;.
              Participate in our events and show us what you've got!
            </p>
            <a href="/contact">
              <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#FF006E] to-[#9D4EDD] text-white font-medium hover:opacity-90 transition-opacity">
                Get in Touch
              </button>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
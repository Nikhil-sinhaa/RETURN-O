// app/(site)/achievements/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllAchievements } from '@/lib/sanity.fetch';
import { AchievementsGrid } from '@/components/achievements/AchievementsGrid';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { GradientOrb } from '@/components/effects/GradientOrb';
import { GridBackground } from '@/components/effects/GridBackground';
import { Trophy, Medal, Star, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Achievements | RETURN 0; - IIIT Dharwad',
  description: 'Celebrating the achievements of RETURN 0; members in competitive programming contests and hackathons.',
};

async function AchievementsContent() {
  const achievements = await getAllAchievements();

  if (!achievements || achievements.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-6">🏆</div>
        <h3 className="text-2xl font-semibold text-white mb-4">Achievements Coming Soon</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          We&apos;re compiling our achievements. Check back soon to see what our members have accomplished!
        </p>
      </div>
    );
  }

  // Group by category
  const icpcAchievements = achievements.filter(a => a.category === 'individual');
  const contestAchievements = achievements.filter(a => a.category === 'team');
  const hackathonAchievements = achievements.filter(a => a.category === 'club');
  const otherAchievements = achievements.filter(a => !['individual', 'team', 'club'].includes(a.category || ''));

  return (
    <div className="space-y-24">
      {/* ICPC Achievements */}
      {icpcAchievements.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFEA00]/20 to-[#FF006E]/20 border border-[#FFEA00]/30">
              <Trophy className="w-6 h-6 text-[#FFEA00]" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">ICPC Achievements</h2>
              <p className="text-gray-400">Our performance in the ACM ICPC</p>
            </div>
          </div>
          <AchievementsGrid achievements={icpcAchievements} />
        </section>
      )}

      {/* Contest Achievements */}
      {contestAchievements.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FF006E]/20 to-[#9D4EDD]/20 border border-[#FF006E]/30">
              <Medal className="w-6 h-6 text-[#FF006E]" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Contest Victories</h2>
              <p className="text-gray-400">Winning moments from various contests</p>
            </div>
          </div>
          <AchievementsGrid achievements={contestAchievements} />
        </section>
      )}

      {/* Hackathon Achievements */}
      {hackathonAchievements.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#9D4EDD]/20 to-[#00F5FF]/20 border border-[#9D4EDD]/30">
              <Star className="w-6 h-6 text-[#9D4EDD]" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Hackathon Wins</h2>
              <p className="text-gray-400">Building and innovating under pressure</p>
            </div>
          </div>
          <AchievementsGrid achievements={hackathonAchievements} />
        </section>
      )}

      {/* Other Achievements */}
      {otherAchievements.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#00F5FF]/20 to-[#FFEA00]/20 border border-[#00F5FF]/30">
              <Award className="w-6 h-6 text-[#00F5FF]" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Other Achievements</h2>
              <p className="text-gray-400">More accomplishments we&apos;re proud of</p>
            </div>
          </div>
          <AchievementsGrid achievements={otherAchievements} />
        </section>
      )}
    </div>
  );
}

export default function AchievementsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      <GridBackground />

      {/* Decorative orbs */}
      <GradientOrb
        color="yellow"
        size="lg"
        className="absolute -right-40 top-20 opacity-20"
      />
      <GradientOrb
        color="cyan"
        size="md"
        className="absolute -left-40 bottom-40 opacity-20"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFEA00]/10 border border-[#FFEA00]/30 mb-6">
            <Trophy className="w-4 h-4 text-[#FFEA00]" />
            <span className="text-sm text-[#FFEA00] font-medium">Hall of Fame</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#FF006E] via-[#9D4EDD] to-[#00F5FF] bg-clip-text text-transparent">
              Our Achievements
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Celebrating excellence in competitive programming. These are the moments
            that make us proud to be part of RETURN 0;
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { icon: '🥇', value: '50+', label: 'Top 10 Finishes' },
            { icon: '🏆', value: '20+', label: 'Contest Wins' },
            { icon: '🎯', value: '100+', label: 'Prizes Won' },
            { icon: '🌟', value: '5+', label: 'ICPC Regionals' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-xl bg-[rgba(18,18,26,0.75)] backdrop-blur-xl border border-white/10 text-center hover:border-[#FFEA00]/50 transition-all duration-300 group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#FFEA00] to-[#FF006E] bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Achievements Content */}
        <Suspense fallback={
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        }>
          <AchievementsContent />
        </Suspense>
      </div>
    </main>
  );
}
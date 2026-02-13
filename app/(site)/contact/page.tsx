// app/(site)/contact/page.tsx
import { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { GradientOrb } from '@/components/effects/GradientOrb';
import { GridBackground } from '@/components/effects/GridBackground';
import Link from 'next/link';
import {
  Mail,
  MapPin,
  MessageSquare,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  ExternalLink
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | RETURN 0; - IIIT Dharwad',
  description: 'Get in touch with RETURN 0; - Competitive Programming Club of IIIT Dharwad. We\'d love to hear from you!',
};

const socialLinks = [
  {
    name: 'GitHub',
    icon: Github,
    href: 'https://github.com/return0-iiitdwd',
    color: '#fff',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://linkedin.com/company/return0-iiitdwd',
    color: '#0A66C2',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    href: 'https://twitter.com/return0_iiitdwd',
    color: '#1DA1F2',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://instagram.com/return0.iiitdwd',
    color: '#E4405F',
  },
];

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'return0@iiitdwd.ac.in',
    href: 'mailto:return0@iiitdwd.ac.in',
    color: '#FF006E',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'IIIT Dharwad, Karnataka, India',
    href: 'https://maps.google.com/?q=IIIT+Dharwad',
    color: '#9D4EDD',
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 relative">
      <GridBackground />

      {/* Decorative orbs */}
      <GradientOrb
        color="pink"
        className="absolute left-0 top-40 w-[500px] h-[500px] opacity-20"
      />
      <GradientOrb
        color="cyan"
        className="absolute right-0 bottom-20 w-[400px] h-[400px] opacity-20"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00F5FF]/20 border border-[#00F5FF]/50 mb-6">
            <MessageSquare className="w-4 h-4 text-[#00F5FF]" />
            <span className="text-sm text-[#00F5FF]">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#FF006E] via-[#9D4EDD] to-[#00F5FF] bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions about RETURN 0;? Want to collaborate or join us?
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="order-2 lg:order-1">
            <div className="p-8 rounded-2xl bg-[rgba(18,18,26,0.75)] backdrop-blur-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              <ContactForm />
            </div>
          </div>

          {/* Contact Info */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Contact Details */}
            <div className="p-8 rounded-2xl bg-[rgba(18,18,26,0.75)] backdrop-blur-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <item.icon
                        className="w-5 h-5"
                        style={{ color: item.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                      <p className="text-white group-hover:text-[#00F5FF] transition-colors flex items-center gap-2">
                        {item.value}
                        {item.href.startsWith('http') && (
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="p-8 rounded-2xl bg-[rgba(18,18,26,0.75)] backdrop-blur-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Follow Us</h2>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <social.icon
                      className="w-5 h-5 transition-colors"
                      style={{ color: social.color }}
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#FF006E]/20 to-[#9D4EDD]/20 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/team" className="text-gray-400 hover:text-[#00F5FF] transition-colors flex items-center gap-2">
                    → Meet our team
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-gray-400 hover:text-[#00F5FF] transition-colors flex items-center gap-2">
                    → Upcoming events
                  </Link>
                </li>
                <li>
                  <Link href="/contests" className="text-gray-400 hover:text-[#00F5FF] transition-colors flex items-center gap-2">
                    → Live contests
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-[#00F5FF] transition-colors flex items-center gap-2">
                    → Read our blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-4">
            {[
              {
                q: 'How can I join RETURN 0;?',
                a: 'Anyone from IIIT Dharwad can join! Participate in our events, contests, and workshops. Stay active and show your passion for competitive programming.',
              },
              {
                q: 'Do I need prior CP experience to join?',
                a: 'Not at all! We welcome beginners and experienced coders alike. Our workshops are designed to help you start from scratch.',
              },
              {
                q: 'How often do you conduct events?',
                a: 'We conduct weekly practice sessions, monthly contests, and regular workshops. Check our events page for the latest schedule.',
              },
              {
                q: 'Can I contribute to the club?',
                a: 'Absolutely! We\'re always looking for volunteers to help organize events, create content, or mentor juniors. Reach out to us!',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-[rgba(18,18,26,0.75)] backdrop-blur-xl border border-white/10 hover:border-[#9D4EDD]/50 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
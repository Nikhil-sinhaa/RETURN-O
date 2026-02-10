import { defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'hero', title: 'Hero Section' },
    { name: 'seo', title: 'SEO' },
    { name: 'social', title: 'Social Media' },
    { name: 'contact', title: 'Contact Info' },
  ],
  fields: [
    // General
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
      initialValue: 'RETURN 0;',
    }),
    defineField({
      name: 'siteTagline',
      title: 'Site Tagline',
      type: 'string',
      group: 'general',
      initialValue: 'Competitive Programming Club of IIIT Dharwad',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'general',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      group: 'general',
    }),
    
    // Hero Section
    defineField({
      name: 'hero',
      title: 'Hero Content',
      type: 'heroContent',
      group: 'hero',
    }),
    
    // SEO
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'seo',
      group: 'seo',
    }),
    
    // Social Media
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'twitterUrl',
      title: 'Twitter/X URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'discordUrl',
      title: 'Discord URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      group: 'social',
    }),
    
    // Contact Info
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      group: 'contact',
      rows: 3,
    }),
    
    // Footer
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'string',
      group: 'general',
      initialValue: '© 2025 RETURN 0; - IIIT Dharwad. All rights reserved.',
    }),
    
    // Announcement Banner
    defineField({
      name: 'announcementBanner',
      title: 'Announcement Banner',
      type: 'object',
      group: 'general',
      fields: [
        {
          name: 'enabled',
          title: 'Show Banner',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'message',
          title: 'Message',
          type: 'string',
        },
        {
          name: 'link',
          title: 'Link',
          type: 'url',
        },
        {
          name: 'linkText',
          title: 'Link Text',
          type: 'string',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'siteName',
      subtitle: 'siteTagline',
    },
  },
});
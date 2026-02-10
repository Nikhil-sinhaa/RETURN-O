import { defineField, defineType } from 'sanity';
import { Trophy as TrophyIcon } from 'lucide-react';

export default defineType({
  name: 'achievement',
  title: 'Achievement',
  type: 'document',
  icon: TrophyIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Achievement Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'achievementType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Contest Win', value: 'contest-win' },
          { title: 'Ranking', value: 'ranking' },
          { title: 'Certification', value: 'certification' },
          { title: 'Project', value: 'project' },
          { title: 'Recognition', value: 'recognition' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Image/Certificate',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'members',
      title: 'Team Members',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'teamMember' }] }],
    }),
    defineField({
      name: 'date',
      title: 'Achievement Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'platform',
      title: 'Platform/Competition',
      type: 'string',
      description: 'e.g., Codeforces, ICPC, Google',
    }),
    defineField({
      name: 'rank',
      title: 'Rank/Position',
      type: 'string',
      description: 'e.g., "1st Place", "Top 100"',
    }),
    defineField({
      name: 'link',
      title: 'Proof Link',
      type: 'url',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Achievement',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: 'Date (Newest)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'platform',
      date: 'date',
      media: 'image',
    },
    prepare({ title, subtitle, date, media }) {
      const formattedDate = date ? new Date(date).toLocaleDateString() : '';
      return {
        title,
        subtitle: `${subtitle || ''} • ${formattedDate}`,
        media,
      };
    },
  },
});
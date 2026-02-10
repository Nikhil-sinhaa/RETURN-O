import { defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons';

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'President', value: 'president' },
          { title: 'Vice President', value: 'vice-president' },
          { title: 'Technical Lead', value: 'tech-lead' },
          { title: 'Event Coordinator', value: 'event-coordinator' },
          { title: 'Content Lead', value: 'content-lead' },
          { title: 'Design Lead', value: 'design-lead' },
          { title: 'Core Member', value: 'core-member' },
          { title: 'Member', value: 'member' },
          { title: 'Alumni', value: 'alumni' },
          { title: 'Faculty Advisor', value: 'faculty-advisor' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'batch',
      title: 'Batch Year',
      type: 'string',
      description: 'e.g., 2022-2026',
    }),
    defineField({
      name: 'branch',
      title: 'Branch',
      type: 'string',
      options: {
        list: [
          { title: 'Computer Science', value: 'cse' },
          { title: 'Electronics & Communication', value: 'ece' },
          { title: 'Data Science', value: 'dsai' },
        ],
      },
    }),
    
    // Competitive Programming Handles
    defineField({
      name: 'codeforcesHandle',
      title: 'Codeforces Handle',
      type: 'string',
      description: 'Codeforces username for live rating display',
    }),
    defineField({
      name: 'codechefHandle',
      title: 'CodeChef Handle',
      type: 'string',
    }),
    defineField({
      name: 'leetcodeHandle',
      title: 'LeetCode Handle',
      type: 'string',
    }),
    defineField({
      name: 'atcoderHandle',
      title: 'AtCoder Handle',
      type: 'string',
    }),
    
    // Social Links
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'twitterUrl',
      title: 'Twitter/X URL',
      type: 'url',
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Personal Website',
      type: 'url',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    
    // Ordering
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 100,
    }),
    defineField({
      name: 'isActive',
      title: 'Active Member',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
    },
  },
});
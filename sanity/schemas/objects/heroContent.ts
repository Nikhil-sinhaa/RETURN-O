import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'heroContent',
  title: 'Hero Content',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'RETURN 0;',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'Competitive Programming Club of IIIT Dharwad',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      initialValue: 'Where code meets competition. Join us to sharpen your algorithmic skills and compete with the best.',
    }),
    defineField({
      name: 'typingTexts',
      title: 'Terminal Typing Texts',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Texts that will be typed in the terminal animation',
      initialValue: ['RETURN 0;', 'Competitive Programming', 'IIIT Dharwad', 'Code. Compete. Conquer.'],
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'ctaButton',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'ctaButton',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
    }),
    defineField({
      name: 'showContests',
      title: 'Show Live Contests',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showParticles',
      title: 'Show Particle Effects',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});
import { defineField, defineType } from 'sanity';
import { MenuIcon } from '@sanity/icons';

export default defineType({
  name: 'navItem',
  title: 'Navigation Item',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Internal path (e.g., /events) or external URL',
    }),
    defineField({
      name: 'isExternal',
      title: 'External Link',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isVisible',
      title: 'Visible',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'children',
      title: 'Dropdown Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'href', type: 'string', title: 'Link' },
            { name: 'description', type: 'string', title: 'Description' },
          ],
        },
      ],
    }),
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'href',
    },
  },
});
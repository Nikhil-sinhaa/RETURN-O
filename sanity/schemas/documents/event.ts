// sanity/schemas/documents/event.ts

import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "title",
      title: "Event Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "eventType",
      title: "Event Type",
      type: "string",
      options: {
        list: [
          { title: "Contest", value: "contest" },
          { title: "Workshop", value: "workshop" },
          { title: "Webinar", value: "webinar" },
          { title: "Hackathon", value: "hackathon" },
          { title: "Meetup", value: "meetup" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      validation: (Rule: any) => Rule.required().max(300),
    }),

    defineField({
      name: "content",
      title: "Full Content",
      type: "portableText",
    }),

    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "startDate",
      title: "Start Date & Time",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "endDate",
      title: "End Date & Time",
      type: "datetime",
    }),

    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
    }),

    defineField({
      name: "registrationLink",
      title: "Registration Link",
      type: "url",
    }),

    defineField({
      name: "isUpcoming",
      title: "Is Upcoming Event",
      type: "boolean",
      initialValue: true,
    }),

    defineField({
      name: "isFeatured",
      title: "Featured Event",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],

  orderings: [
    {
      title: "Event Date (Newest)",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
    {
      title: "Event Date (Oldest)",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "eventType",
      date: "startDate",
      media: "coverImage",
    },
    prepare({ title, subtitle, date, media }: any) {
      const formattedDate = date ? new Date(date).toLocaleDateString() : "";
      return {
        title,
        subtitle: `${subtitle} • ${formattedDate}`,
        media,
      };
    },
  },
});

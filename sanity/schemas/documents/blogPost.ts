import { defineField, defineType } from "sanity"
import { DocumentTextIcon } from "@sanity/icons"

export default defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  icon: DocumentTextIcon,

  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      validation: (Rule: any) => Rule.required().max(300),
    }),

    defineField({
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "teamMember" }],
    }),

    defineField({
      name: "publishedAt",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "content",
      type: "portableText",
    }),

    defineField({
      name: "categories",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Tutorial", value: "tutorial" },
          { title: "Contest Review", value: "contest-review" },
          { title: "Algorithm", value: "algorithm" },
          { title: "Data Structure", value: "data-structure" },
          { title: "CP Tips", value: "cp-tips" },
          { title: "Interview Prep", value: "interview-prep" },
          { title: "Announcement", value: "announcement" },
          { title: "Other", value: "other" },
        ],
      },
    }),

    defineField({
      name: "tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "difficulty",
      type: "string",
      options: {
        list: [
          { title: "Beginner", value: "beginner" },
          { title: "Intermediate", value: "intermediate" },
          { title: "Advanced", value: "advanced" },
          { title: "Expert", value: "expert" },
        ],
      },
    }),

    defineField({
      name: "readTime",             // renamed to match BlogPost type
      title: "Reading Time (minutes)",
      type: "number",
    }),

    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "published",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "seo",
      type: "seo",
    }),
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      date: "publishedAt",
      media: "coverImage",
    },
    prepare(selection: {
      title?: string
      author?: string
      date?: string
      media?: any
    }) {
      const { title, author, date, media } = selection
      return {
        title,
        subtitle: `${author ?? "Unknown"} — ${date ?? ""}`,
        media,
      }
    },
  },
})

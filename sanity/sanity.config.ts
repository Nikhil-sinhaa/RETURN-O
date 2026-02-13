// sanity/sanity.config.ts
'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { colorInput } from '@sanity/color-input';
import { media } from 'sanity-plugin-media';
import { schemaTypes } from './schemas';
import { apiVersion, dataset, projectId } from './env';

// Custom studio theme matching RETURN 0; branding
const customTheme = {
  base: {
    _dark: {
      bg: ['#0A0A0F', '#121218', '#1a1a24'],
      fg: ['#ffffff', '#f0f0f0', '#d0d0d0'],
      border: ['#2a2a3a', '#3a3a4a', '#4a4a5a'],
      focusRing: '#9D4EDD',
      shadow: {
        umbra: ['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.3)'],
        penumbra: ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.2)'],
        ambient: ['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.1)'],
      },
    },
  },
  color: {
    base: {
      _dark: {
        bg: ['#0A0A0F', '#121218', '#1a1a24'],
        fg: ['#ffffff', '#f0f0f0', '#d0d0d0'],
      },
    },
    primary: {
      _dark: {
        bg: ['#9D4EDD', '#8B3FC9', '#7930B5'],
        fg: ['#ffffff', '#f0f0f0', '#e0e0e0'],
      },
    },
    success: {
      _dark: {
        bg: ['#00F5FF', '#00D4DD', '#00B3BB'],
        fg: ['#0A0A0F', '#121218', '#1a1a24'],
      },
    },
    warning: {
      _dark: {
        bg: ['#FFEA00', '#E6D400', '#CCBD00'],
        fg: ['#0A0A0F', '#121218', '#1a1a24'],
      },
    },
    danger: {
      _dark: {
        bg: ['#FF006E', '#E6005F', '#CC0050'],
        fg: ['#ffffff', '#f0f0f0', '#e0e0e0'],
      },
    },
  },
  fonts: {
    heading: { family: 'Inter, system-ui, sans-serif' },
    text: { family: 'Inter, system-ui, sans-serif' },
    code: { family: 'JetBrains Mono, monospace' },
  },
};

// Define the desk structure for organized content management
const deskStructure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      // Site Settings (Singleton)
      S.listItem()
        .title('Site Settings')
        .icon(() => '⚙️')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),

      S.divider(),

      // Navigation
      S.listItem()
        .title('Navigation')
        .icon(() => '🧭')
        .child(
          S.list()
            .title('Navigation')
            .items([
              S.documentTypeListItem('navItem').title('Navigation Items').icon(() => '🔗'),
              S.documentTypeListItem('socialLink').title('Social Links').icon(() => '📱'),
            ])
        ),

      S.divider(),

      // Content Types
      S.listItem()
        .title('Events')
        .icon(() => '📅')
        .child(S.documentTypeList('event').title('Events')),

      S.listItem()
        .title('Team Members')
        .icon(() => '👥')
        .child(S.documentTypeList('teamMember').title('Team Members')),

      S.listItem()
        .title('Blog Posts')
        .icon(() => '📝')
        .child(S.documentTypeList('blogPost').title('Blog Posts')),

      S.listItem()
        .title('Achievements')
        .icon(() => '🏆')
        .child(S.documentTypeList('achievement').title('Achievements')),

      S.divider(),

      // Removed "All Documents" section - was causing schema error
    ]);

export default defineConfig({
  name: 'return0-studio',
  title: 'RETURN 0; Studio',

  projectId,
  dataset,
  apiVersion,

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    codeInput(),
    colorInput(),
    media(),
  ],

  schema: {
    types: schemaTypes,
  },

  // Custom studio configuration
  studio: {
    components: {
      // Custom logo could be added here
    },
  },

  // Form configuration
  form: {
    // Enable image hotspot by default
    image: {
      assetSources: (previousAssetSources) => previousAssetSources,
    },
  },

  // Theme customization - removed custom theme due to compatibility issues
  // You can re-add a simpler theme later if needed
});
import { type SchemaTypeDefinition } from 'sanity';

// Documents
import siteSettings from './documents/siteSettings';
import event from './documents/event';
import teamMember from './documents/teamMember';
import blogPost from './documents/blogPost';
import achievement from './documents/achievement';
import navItem from './documents/navItem';
import socialLink from './documents/socialLink';

// Objects
import seo from './objects/seo';
import portableText from './objects/portableText';
import heroContent from './objects/heroContent';
import ctaButton from './objects/ctaButton';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  siteSettings,
  event,
  teamMember,
  blogPost,
  achievement,
  navItem,
  socialLink,
  // Objects
  seo,
  portableText,
  heroContent,
  ctaButton,
];
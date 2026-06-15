// Auto-discovery of galleries from the folder structure.
//
// Drop an image into `src/assets/galleries/<category>/` and it appears in that
// gallery. Create a new folder and a new gallery page + nav entry appear. Move a
// file between folders and it recategorizes on the next build. No per-image config.
//
// The folder name directly under `galleries/` IS the URL slug.

import type { ImageMetadata } from 'astro';
import { categories as categoryConfig } from './categories';

export interface Artwork {
  /** Imported image, ready for astro:assets <Image> / getImage(). */
  image: ImageMetadata;
  /** Base filename without extension (used only for sorting today). */
  name: string;
}

export interface Gallery {
  /** URL slug == folder name. */
  slug: string;
  /** Display label (from categories.ts, else Title-Cased slug). */
  label: string;
  order: number;
  navParent?: string;
  artworks: Artwork[];
}

/** Slugs that would collide with a static page; a gallery folder may not use them. */
const RESERVED_SLUGS = new Set(['index', 'biography', 'exhibits', 'about-this-site', '404']);

const GALLERY_PREFIX = '/src/assets/galleries/';

// Eager glob so each image is part of the build graph and gets optimized.
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/galleries/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

/** Title-case a slug like "graphic-design" -> "Graphic Design". */
function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

/** Leading numeric prefix for ordering ("01-foo" -> 1); no prefix sorts last. */
function leadingNumber(name: string): number {
  const match = name.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : Number.POSITIVE_INFINITY;
}

function buildGalleries(): Gallery[] {
  const bySlug = new Map<string, Artwork[]>();

  for (const [path, mod] of Object.entries(modules)) {
    const relative = path.slice(GALLERY_PREFIX.length); // e.g. "paintings/01-foo.jpg"
    const segments = relative.split('/');
    const slug = segments[0];
    const file = segments[segments.length - 1];
    const name = file.replace(/\.[^.]+$/, '');

    if (RESERVED_SLUGS.has(slug)) {
      throw new Error(
        `Gallery folder "src/assets/galleries/${slug}/" collides with a reserved page ` +
          `slug ("${slug}"). Rename the folder.`,
      );
    }

    if (!bySlug.has(slug)) bySlug.set(slug, []);
    bySlug.get(slug)!.push({ image: mod.default, name });
  }

  const galleries: Gallery[] = [];
  for (const [slug, artworks] of bySlug) {
    artworks.sort((a, b) => {
      const na = leadingNumber(a.name);
      const nb = leadingNumber(b.name);
      if (na !== nb) return na - nb;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

    const config = categoryConfig[slug];
    galleries.push({
      slug,
      label: config?.label ?? titleCase(slug),
      order: config?.order ?? Number.POSITIVE_INFINITY,
      navParent: config?.navParent,
      artworks,
    });
  }

  galleries.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
  return galleries;
}

const galleries = buildGalleries();

export function getGalleries(): Gallery[] {
  return galleries;
}

export function getGallery(slug: string): Gallery | undefined {
  return galleries.find((g) => g.slug === slug);
}

/** Generic alt text (no per-artwork titles yet). */
export function artworkAlt(gallery: Gallery): string {
  return `Artwork by Tom Rubick — ${gallery.label}`;
}

export interface NavItem {
  slug: string;
  label: string;
  children: NavItem[];
}

/** Nav tree: top-level galleries with `navParent` children nested beneath them. */
export function getGalleryNav(): NavItem[] {
  const top: NavItem[] = [];
  const childrenByParent = new Map<string, NavItem[]>();

  for (const g of galleries) {
    const item: NavItem = { slug: g.slug, label: g.label, children: [] };
    if (g.navParent) {
      if (!childrenByParent.has(g.navParent)) childrenByParent.set(g.navParent, []);
      childrenByParent.get(g.navParent)!.push(item);
    } else {
      top.push(item);
    }
  }

  for (const item of top) {
    item.children = childrenByParent.get(item.slug) ?? [];
  }
  return top;
}

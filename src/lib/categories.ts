// Display configuration for gallery categories.
//
// IMPORTANT: this controls *labels, ordering, and nav grouping only*. It never
// affects URLs — a gallery's URL is always its folder name under
// `src/assets/galleries/`. A folder that isn't listed here still works; it just
// gets an auto Title-Cased label and sorts after the configured ones.
//
//   navParent: render this category as a sub-item under another category's menu
//   (the URL stays flat, e.g. /planets — this only affects how the nav groups it).

export interface CategoryConfig {
  label: string;
  order: number;
  navParent?: string;
}

export const categories: Record<string, CategoryConfig> = {
  paintings: { label: 'Paintings', order: 1 },
  drawings: { label: 'Drawings and Illustrations', order: 2 },
  'graphic-design': { label: 'Graphic Design', order: 3 },
  press: { label: 'Ceramics and 3D', order: 4 }, // historical Wix slug, kept for link parity
  planets: { label: 'Planets', order: 5, navParent: 'press' }, // submenu of Ceramics, flat /planets URL
  photography: { label: 'Photography', order: 6 },
  digital: { label: 'Digital', order: 7 },
};

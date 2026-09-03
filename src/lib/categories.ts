// Display configuration for gallery categories.
//
// IMPORTANT: this controls *labels and ordering only*. It never affects URLs —
// a gallery's URL is always its folder name under `src/assets/galleries/`. A
// folder that isn't listed here still works; it just gets an auto Title-Cased
// label and sorts after the configured ones.

export interface CategoryConfig {
  label: string;
  order: number;
}

export const categories: Record<string, CategoryConfig> = {
  paintings: { label: 'Paintings', order: 1 },
  drawings: { label: 'Drawings and Illustrations', order: 2 },
  'graphic-design': { label: 'Graphic Design', order: 3 },
  ceramics: { label: 'Ceramics', order: 4 }, // was the Wix /press slug; 301 in public/_redirects
  planets: { label: 'Planets', order: 5 },
  photography: { label: 'Photography', order: 6 },
};

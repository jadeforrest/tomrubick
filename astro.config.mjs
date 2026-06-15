// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The public site URL. Used for sitemap + canonical/OG URLs.
// Update if the production hostname ever changes.
export default defineConfig({
  site: 'https://www.tomrubick.com',
  integrations: [sitemap()],
  image: {
    // Built-in sharp service, tuned for faithful art reproduction.
    // High encode quality + lanczos3 resampling so paintings stay crisp.
    //
    // NOTE on color: sharp does not preserve embedded ICC profiles through the
    // resize pipeline, and there is no Astro config option to keep them. To avoid
    // color shifts, source images must be converted to sRGB before import
    // (see project.md Phase 5). Web-standard sRGB JPEGs need no special handling.
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        kernel: 'lanczos3',
        webp: { quality: 82, effort: 4 },
        jpeg: { quality: 85, mozjpeg: true },
        png: { compressionLevel: 8 },
      },
    },
  },
});

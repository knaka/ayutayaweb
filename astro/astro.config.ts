// @ts-check
import { defineConfig } from 'astro/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@astrojs/react';

const common = {
  srcDir: "./src",
  publicDir: "./public",
  typescript: {
    strict: true,
  },
  integrations: [react()],
};

const viteCommon = {
  envDir: "..",
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
      sass: {
        api: 'modern',
      },
    }
  },
  plugins: [
    tsconfigPaths(),
  ],
};

const dynamicUrl = `http://127.0.0.1:${process.env.ASTRO_DYNAMIC_PORT || 18080}`;

// https://astro.build/config
export default defineConfig((process.env.NODE_ENV === "development")? {
  ...common,
  trailingSlash: "never",
  vite: {
    ...viteCommon,
    plugins: [],
    // This seems not to work on production build
    cacheDir: "../node_modules/.vite-astro",
    server: {
      fs: {
        allow: [
          ".",
          "../node_modules",
          "../lib",
        ]
      },
      proxy: {
        // Server Options | Vite https://vite.dev/config/server-options.html
        // "if the key starts with `^`, it will be interpreted as a `RegExp`."
        "/api/": dynamicUrl,
        "/var/": dynamicUrl,
        "/ssg/": dynamicUrl,
        // Remix development server
        "/remix/": dynamicUrl,
        "^/@id/.*remix.*": dynamicUrl,
        "^/.*vite-remix.*": dynamicUrl,
      },
    },
  },
}: {
  ...common,
  vite: {
    ...viteCommon,
  },
  build: {
    format: 'file',
  },
  outDir: "./build",
  experimental:{
    contentCollectionCache: true,
  },
});

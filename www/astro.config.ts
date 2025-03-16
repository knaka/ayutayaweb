// @ts-check
import { defineConfig } from 'astro/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@astrojs/react';

const common = {
  srcDir: "./src-astro",
  publicDir: "./public",
  typescript: {
    strict: true,
  },
  integrations: [react()],
};

const viteCommon = {
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

// https://astro.build/config
export default defineConfig((process.env.NODE_ENV === "development")? {
  ...common,
  trailingSlash: "never",
  vite: {
    ...viteCommon,
    plugins: [],
    cacheDir: "../node_modules/.vite",
    server: {
      fs: {
        allow: [
          ".",
          "../node_modules",
        ]
      },
      proxy: {
        // Server Options | Vite https://vite.dev/config/server-options.html
        // "if the key starts with `^`, it will be interpreted as a `RegExp`."
        "/app": `http://127.0.0.1:${process.env.ASTRO_DYNAMIC_PORT || 18080}`,
        "^/@id/.*remix.*": `http://127.0.0.1:${process.env.ASTRO_DYNAMIC_PORT || 18080}`,
        "/api": `http://127.0.0.1:${process.env.ASTRO_DYNAMIC_PORT || 18080}`,
        "/var": `http://127.0.0.1:${process.env.ASTRO_DYNAMIC_PORT || 18080}`,
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
  outDir: "./dist",
  experimental:{
    contentCollectionCache: true,
  },
});

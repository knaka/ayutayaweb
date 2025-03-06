// @ts-check
import { defineConfig } from 'astro/config';
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@astrojs/react';
 
const common = {
  srcDir: "./src-astro",
  publicDir: "./public",
  typescript: {
    strict: true,
  },
  integrations: [react()],
  // base: "/foo",
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
  }
};

// https://astro.build/config
export default defineConfig((process.env.NODE_ENV === "development")? {
  ...common,
  trailingSlash: "never",
  vite: {
    ...viteCommon,
    server: {
      proxy: {
        "/api": {
          target: `http://127.0.0.1:${process.env.ASTRO_DYNAMIC_PORT || 18080}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
        "/var": {
          target: `http://127.0.0.1:${process.env.ASTRO_DYNAMIC_PORT || 18080}`,
        }
      }
    },
    plugins: [tsconfigPaths()],
  }
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

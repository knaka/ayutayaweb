// @ts-check
import { defineConfig } from 'astro/config';

const common = {
  srcDir: "./src-astro",
  publicDir: "./public",
};

// https://astro.build/config
export default defineConfig((process.env.NODE_ENV === "development")? {
  ...common,
  vite: {
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
    }
  }
}: {
  ...common,
  outDir: "./dist",
  experimental:{
    contentCollectionCache: true,
  },
});

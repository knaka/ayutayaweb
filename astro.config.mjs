// @ts-check
import { defineConfig } from 'astro/config';

const common = {
  srcDir: "./src",
  publicDir: "./public",
};

// https://astro.build/config
export default defineConfig((process.env.NODE_ENV === "development")? {
  ...common,
  vite: {
    server: {
      proxy: {
        "/api": {
          target: `http://127.0.0.1:${process.env.API_DEV_PORT || 18080}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
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

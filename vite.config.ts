// This is essentially a Remix configuration file despite of the file name // vite.config.ts | Remix https://remix.run/docs/en/main/file-conventions/vite-config

import { defineConfig } from "vite";
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin,
} from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import { getLoadContext } from "./load-context";

declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  cacheDir: "./node_modules/.vite-remix",
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
    cloudflareDevProxyVitePlugin({
      getLoadContext,
    }),
    remix({
      // Defaults to `./app/`
      appDirectory: "remix",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
    // Custom plugin resolves warning - Failed to resolve "remix:manifest" from /Users/... An id should be written. Did you pass a URL? // Failed to resolve remix:manifest on fresh create-remix app · Issue #10515 · remix-run/remix https://github.com/remix-run/remix/issues/10515
    {
      name: "remix-manifest-resolver",
      resolveId(id) {
        if (id === "remix:manifest") {
          return id;
        }
      },
      // Optional: warning is suppressed without this hook
      // Provides an empty object for 'remix:manifest' if HMR triggers, but HMR remains non-functional
      load(id) {
        if (id === "remix:manifest") {
          return "export default {}";
        }
      }
    }, 
  ],
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser"],
    },
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
  },
  build: {
    minify: true,
    assetsDir: "_remix",
    watch: null,
  },
});

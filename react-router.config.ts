import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "rr",
  ssr: true,
  future: {
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;

import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "rrapp",
  ssr: true,
  future: {
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;

# vim: set filetype=sh tabstop=2 shiftwidth=2 expandtab :
# shellcheck shell=sh
"${sourced_2635e26-false}" && return 0; sourced_2635e26=true

. ./task-node.lib.sh

subcmd_remix() { # Run remix.
  run_node_modules_bin @remix-run/dev dist/cli.js "$@"
}

task_dev() { # Start development server
  subcmd_remix vite:dev
}

subcmd_wrangler() { # Run the Cloudflare Wrangler command.
  run_node_modules_bin wrangler bin/wrangler.js "$@"
}

: "${wrangler_toml_path:=$PROJECT_DIR/wrangler.toml}"

task_deploy() { # Deploy
  subcmd_wrangler deploy
}

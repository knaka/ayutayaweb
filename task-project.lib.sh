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

task_remix__build() { # Build
  subcmd_remix vite:build $PROJECT_DIR/remix/
}

task_build() { # Build
  task_remix__build
}

subcmd_wrangler() { # Run the Cloudflare Wrangler command.
  run_node_modules_bin wrangler bin/wrangler.js "$@"
}

: "${workers_wrangler_toml_path:=$PROJECT_DIR/wrangler.toml}"

set_workers_wrangler_toml_path() {
  workers_wrangler_toml_path="$1"
}

set_workers_wrangler_toml_path "$PROJECT_DIR/workers-wrangler.toml"

task_workers__prod__deploy() { # Deploy the project to the production environment.
  subcmd_wrangler --config "$workers_wrangler_toml_path" deploy "$@"
}

task_workers__prev__deploy() { # Deploy the project to the preview environment.
  task_workers__prod__deploy --env preview
}

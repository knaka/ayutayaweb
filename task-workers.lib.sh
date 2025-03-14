# vim: set filetype=sh tabstop=2 shiftwidth=2 expandtab :
# shellcheck shell=sh
"${sourced_8bf8f23-false}" && return 0; sourced_8bf8f23=true

: "${workers_wrangler_toml_path:=$PROJECT_DIR/wrangler.toml}"

set_workers_wrangler_toml_path() {
  workers_wrangler_toml_path="$1"
}

subcmd_workers_wrangler() { # Run the Cloudflare Wrangler command.
  run_node_modules_bin wrangler bin/wrangler.js --config "$workers_wrangler_toml_path" "$@"
}

task_workers__prod__deploy() { # Deploy the project to the production environment.
  subcmd_workers_wrangler deploy "$@"
}

task_workers__prev__deploy() { # Deploy the project to the preview environment.
  task_workers__prod__deploy --env preview
}

# vim: set filetype=sh tabstop=2 shiftwidth=2 expandtab :
# shellcheck shell=sh
"${sourced_8bf8f23-false}" && return 0; sourced_8bf8f23=true

: "${workers_dir_path:=$PROJECT_DIR}"
: "${workers_wrangler_toml_path:=$workers_dir_path/wrangler.toml}"

set_workers_dir_path() {
  workers_dir_path="$1"
  workers_wrangler_toml_path="$workers_dir_path/wrangler.toml"
}

subcmd_workers_wrangler() { # Run the Cloudflare Wrangler command.
  run_node_modules_bin wrangler bin/wrangler.js --config "$workers_wrangler_toml_path" "$@"
}

task_workers__prod__deploy() { # Deploy the project to the production environment.
  subcmd_workers_wrangler deploy "$@"
}

task_workers__prev__deploy() { # Deploy the project to the preview environment.
  subcmd_workers_wrangler deploy --env preview "$@"
}

task_workers__prod__tail() { # Tail the logs of the production environment.
  subcmd_workers_wrangler tail "$@"
}

task_workers__prev__tail() { # Tail the logs of the preview environment.
  subcmd_workers_wrangler tail --env preview
}

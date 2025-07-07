# vim: set filetype=sh tabstop=2 shiftwidth=2 expandtab :
# shellcheck shell=sh
"${sourced_9da69a1-false}" && return 0; sourced_9da69a1=true

. ./task.sh
. ./task-node.lib.sh

: "${rr_project_dir_b4b3371:=$PROJECT_DIR}"

set_rr_project_dir() {
  rr_project_dir_b4b3371="$1"
}

subcmd_rr() { # Run rr.
  # run_node_modules_bin @react-router dev/bin.js "$@" "$rr_project_dir_b4b3371"
  run_node_modules_bin @react-router dev/bin.js "$@"
}

task_rr__build() { # Build
  subcmd_rr vite:build
}

task_rr__dev() { # Start development server
  load_env
  local host="${RR_DEV_HOST:-127.0.0.1}"
  local port="${RR_DEV_PORT:-3000}"
  set -- "$@" --host "$host"
  set -- "$@" --port "$port"
  subcmd_rr dev "$@"
}

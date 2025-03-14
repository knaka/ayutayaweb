# vim: set filetype=sh tabstop=2 shiftwidth=2 expandtab :
# shellcheck shell=sh
"${sourced_9da69a1-false}" && return 0; sourced_9da69a1=true

subcmd_remix() { # Run remix.
  run_node_modules_bin @remix-run/dev dist/cli.js "$@"
}

: "${remix_project_dir_b4b3371:=$PROJECT_DIR}"

set_remix_project_dir() {
  remix_project_dir_b4b3371="$1"
}

task_remix__build() { # Build
  subcmd_remix vite:build "$remix_project_dir_b4b3371"
}

task_remix__dev() { # Start development server
  subcmd_remix vite:dev "$remix_project_dir_b4b3371"
}

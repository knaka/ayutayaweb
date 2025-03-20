# vim: set filetype=sh tabstop=2 shiftwidth=2 expandtab :
# shellcheck shell=sh
"${sourced_2635e26-false}" && return 0; sourced_2635e26=true

. ./task-node.lib.sh
. ./task-astro.lib.sh
  set_astro_project_dir "$PROJECT_DIR"/ssg
. ./task-remix.lib.sh
. ./task-workers.lib.sh
. ./task-dev-session.lib.sh
. ./task-astro-dev.lib.sh
. ./task-ip-utils.lib.sh

task_dev() { # Start the development environment
  cleanup_session_env
  local astro_dev_port="$(ip_random_free_port)"
  local remix_dev_port="$(ip_random_free_port)"
  set_session_env_entry \
    "ASTRO_DEV_PORT" "$astro_dev_port" \
    "ASTRO_DYNAMIC_PORT" "$remix_dev_port" \
    "REMIX_DEV_PORT" "$remix_dev_port" \
    # NOP
  chaintrap cleanup_session_env INT EXIT
  # Launch the Remix dev server.
  task_remix__dev --invocation-mode=background </dev/null
  # Then, launch the Astro dev server.
  task_astro__dev
}

subcmd_reclink() {
  local src="$1"
  local dst="$2"
  mkdir -p "$dst"
  (cd "$src" && find . -type d -print0) | xargs -0 -I {} mkdir -p "$dst"/{}
  (cd "$src" && find . -type f -print0) | xargs -0 -I {} ln -f "$src"/{} "$dst"/{}
}

task_merge() { # Merge the output of the Astro and Remix builds
  push_dir "$PROJECT_DIR"
  local dist_dir_path="$PWD"/dist
  rm -fr "$dist_dir_path"
  mkdir -p "$dist_dir_path"
  subcmd_reclink build/client "$dist_dir_path"
  subcmd_reclink ssg/dist "$dist_dir_path"
  pop_dir
}

task_build() { # Build all
  task_remix__build
  task_astro__build
  task_merge
}

subcmd_test() { # Run tests.
  run_node_modules_bin vitest vitest.mjs "$@"
}

task_prod__deploy() { # Deploy the production build
  task_workers__prod__deploy "$@"
}

task_prev__deploy() { # Deploy the previous build
  task_workers__prev__deploy "$@"
}

task_prod__tail() { # Tail the production logs
  task_workers__prod__tail "$@"
}

task_prev__tail() { # Tail the previous logs
  task_workers__prev__tail "$@"
}

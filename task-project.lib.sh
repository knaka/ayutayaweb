# vim: set filetype=sh tabstop=2 shiftwidth=2 expandtab :
# shellcheck shell=sh
"${sourced_1f78f6a-false}" && return 0; sourced_1f78f6a=true

. ./task-pages.lib.sh
  set_pages_functions_src_pattern "$PROJECT_DIR/src-pages/functions/**/*.ts"
. ./task-pages-dev.lib.sh
. ./task-astro-dev.lib.sh
. ./task-ip-utils.lib.sh
. ./task-dev-session.lib.sh

task_dev() {
  cleanup_session_env
  local astro_dev_port="$(ip_random_free_port)"
  local pages_dev_port="$(ip_random_free_port)"
  set_session_env_entry \
    "ASTRO_DEV_PORT" "$astro_dev_port" \
    "ASTRO_DYNAMIC_PORT" "$pages_dev_port" \
    "PAGES_DEV_PORT" "$pages_dev_port" \
    "PAGES_CONTENT_PORT" "$astro_dev_port" \
    # NOP
  chaintrap cleanup_session_env EXIT
  # Launch Pages dev server with the interactive dev session disabled.
  task_pages__dev --invocation-mode=background --show-interactive-dev-session=false
  # Then, launch the Astro dev server.
  task_astro__dev
}

set_test_environment() {
  # export PERSISTENT_D1_DIR_PATH="$persistent_d1_dir_path"
  # PERSISTENT_D1_BINDING="$(subcmd_d1__binding)"
  # export PERSISTENT_D1_BINDING
  # PERSISTENT_D1_ID="$(subcmd_d1__id)"
  # export PERSISTENT_D1_ID
  :
}

subcmd_vitest() { # Run tests with Vite.
  run_node_modules_bin vitest vitest.mjs "$@"
}

subcmd_test() { # Run tests.
  set_test_environment
  subcmd_vitest "$@"
}

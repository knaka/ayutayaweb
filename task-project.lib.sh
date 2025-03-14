# vim: set filetype=sh tabstop=2 shiftwidth=2 expandtab :
# shellcheck shell=sh
"${sourced_2635e26-false}" && return 0; sourced_2635e26=true

. ./task-node.lib.sh
. ./task-astro.lib.sh
  set_astro_project_dir "$PROJECT_DIR"/www
. ./task-pages.lib.sh
  set_pages_wrangler_toml_path "$PROJECT_DIR"/www/wrangler.toml
. ./task-remix.lib.sh
  set_remix_project_dir "$PROJECT_DIR"/svc
. ./task-workers.lib.sh
  set_workers_wrangler_toml_path "$PROJECT_DIR/workers-wrangler.toml"
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

task_build() { # Build all
  task_remix__build
  task_astro__build
}

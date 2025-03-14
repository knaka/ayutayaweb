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

task_build() { # Build
  task_astro__build
  task_remix__build
}

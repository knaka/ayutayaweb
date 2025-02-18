# vim: set filetype=sh tabstop=2 shiftwidth=2 expandtab :
# shellcheck shell=sh
test "${sourced_f1649d9-}" = true && return 0; sourced_f1649d9=true

. ./task.sh
. ./task-node.lib.sh
. ./task-pages.lib.sh
  set_pages_functions_src_pattern "$PROJECT_DIR/src-pages/functions/**/*.ts"
. ./task-pages-dev.lib.sh
. ./task-astro-dev.lib.sh

task_dev() {
  # Launch Pages dev server with the interactive dev session disabled.
  task_pages__dev --invocation-mode=background --show-interactive-dev-session=false
  # Then, launch the Astro dev server.
  task_astro__dev
}

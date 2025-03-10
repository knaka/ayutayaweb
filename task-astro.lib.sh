#!/bin/sh
# shellcheck disable=SC3043
test "${guard_926c124+set}" = set && return 0; guard_926c124=x
set -o nounset -o errexit

. ./task-node.lib.sh

subcmd_astro() { # Run the Astro command.
  run_node_modules_bin astro astro.js "$@"
}

task_astro__build() {
  subcmd_astro build
}

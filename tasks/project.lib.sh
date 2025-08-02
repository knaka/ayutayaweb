# vim: set filetype=sh tabstop=2 shiftwidth=2 expandtab :
# shellcheck shell=sh
"${sourced_785d133-false}" && return 0; sourced_785d133=true

. ./task.sh

task_help() {
cat <<EOF >&2
Usage: task [options] [taskname] [taskname] ...
Run tasks defined in the project.
Options:
  -h, --help    Show this help message and exit.
EOF
}

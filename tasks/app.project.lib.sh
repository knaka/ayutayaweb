# vim: set filetype=sh tabstop=2 shiftwidth=2 expandtab :
# shellcheck shell=sh
"${sourced_45b756a-false}" && return 0; sourced_45b756a=true

. ./task.sh
. ./task-terraform.lib.sh
  set_terraform_path "$PROJECT_DIR"/terraform

# load_env

# : "${APP_PROJECT_NAME=foo}"
# : "${OCI_PROFILE=bar}"

# . ./task-python.lib.sh

# task_foo() {
#   echo "APP_PROJECT_NAME: $APP_PROJECT_NAME"
#   echo "OCI_PROFILE: $OCI_PROFILE"
#   uv run which python3
#   uv run python3 --version
# }

# subcmd_greet() { # [name] Says hello.
#   local name="${1:-}"
#   if test -z "$name"
#   then
#     echo "Usage: ./task greet <name>"
#     return 1
#   fi
#   echo "Hello, $name!"
# }

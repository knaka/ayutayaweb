#!/bin/sh
test "${guard_7bad9f3+set}" = set && return 0; guard_7bad9f3=-

. ./task.sh

# Rewrite the TypeScript code generated by sqlc.
rewrite_sqlcgen_ts() {
  local temp_path
  temp_path="$TEMP_DIR"/rewrite_sqlcgen_typescript
  local file_path
  for file_path in "$@"
  do
    sed -E \
      -e "s/^([[:blank:]]*[_[:alnum:]]+)(: .* \| null;)$/rewrite_null_def${us}\1${us}\2${us}/" -e t \
      -e "s/^(.*\.${lwb}bind\()([^.][^)]*)(\).*)$/rewrite_bind${us}\1${us}\2${us}\3${us}/" -e t \
      -e 's#from "@cloudflare/workers-types/(.*)"#from "@cloudflare/workers-types/\1/index.js"#' \
      -e "s/^(.*)$/nop${us}\1${us}/" <"$file_path" \
    | while IFS= read -r line
    do
      IFS="$us"
      # shellcheck disable=SC2086
      set -- $line
      unset IFS
      op="$1"
      shift
      case "$op" in
        (rewrite_null_def)
          echo "$1?$2"
          ;;
        (rewrite_bind)
          echo "$1$(echo "$2, " | sed -E -e 's/([^,]+), */typeof \1 === "undefined"? null: \1, /g' -e 's/, $//')$3"
          ;;
        (nop)
          echo "$1"
          ;;
        (*)
          echo Unhandled operation: "$op" >&2
          exit 1
          ;;
      esac
    done >"$temp_path"
    mv "$temp_path" "$file_path"
  done
}


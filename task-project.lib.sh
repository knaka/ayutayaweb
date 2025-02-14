# vim: set filetype=sh tabstop=2 shiftwidth=2 expandtab :
# shellcheck shell=sh
test "${sourced_f1649d9-}" = true && return 0; sourced_f1649d9=true

. ./task.sh
. ./task-node.lib.sh
. ./task-pages.lib.sh
. ./task-astro.lib.sh

# --------------------------------------------------------------------------
# Misc
# --------------------------------------------------------------------------

# Write the routes file for the Astro build.
# Refer the site for `_routes.json` file. // Routing · Cloudflare Pages docs https://developers.cloudflare.com/pages/functions/routing/#create-a-_routesjson-file
post_task_astro__build() {
  cat <<'EOF' >dist/_routes.json
{
   "version": 1,
  "include": [
    "/var/*",
    "/api/*"
  ],
  "exclude": [
    "/*.txt",
    "/*.html",
    "/doc/*"
  ]
}
EOF
}

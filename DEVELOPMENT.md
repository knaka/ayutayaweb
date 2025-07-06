# Guide for Developers

## Running Tasks

- Running `./task` without argument shows available tasks/subcommands.
- Tasks `foo:bar` and `baz` are executed with `./task foo:bar baz[arg1,arg2]`. Arguments are passed in brackets.
- Task runner is written with shell script and the task `foo:bar` is implemented in shell script function `task_foo__bar`.
- Subcommand `qux` is executed as `./task qux arg1 arg2` and is implemented as shell script function `subcmd_qux`.

## Development server

- `./task dev` launches development server.
- It launches Remix development server in background and launches Astro development server in foreground. The latter redirects access to dynamic paths to the former. This is configured in `astro/astro.config.ts`.

## Testing

- `./task test` runs Vitest test runner.
- Vitest runs in watch mode by default. If you would like to disable it, use `--run` option.

## Database

- Uses Cloudflare's D1 database. For local development, it uses Miniflare's development D1 database.
- Database schema is defined in `db/schema.sql`. Use task `d1:local:migrate` for local database and `d1:prod:migrate` for production database schema migration. Schema migration uses sqldef, so there's no need to manage schema diffs manually.
- Database access code generation for TypeScript uses [sqlc](https://github.com/sqlc-dev/sqlc). Access queries are located in `db/queries/`. Task `db:gen` generates access code to `db/sqlcgen/`.

## Astro application (SSG)

- The source directory is `astro/`.
- Built with `astro:build` task.
- Contains static site generation (SSG) related files, components, and pages.
- The directory is pointed in `task-project.lib.sh` as `set_astro_project_dir "$PROJECT_DIR"/astro`.
- Build output goes to `astro/dist/` (configured via `outDir` in `astro/astro.config.ts`).

## Remix application (SSR)

- The source directory is `remix/`.
- Built with `remix:build` task.
- Contains React components, routes, and application logic.
- Uses Vite Compiler (not Remix Classic Compiler), configured via `vite.config.ts`.
- App directory configured via `appDirectory` option in `vite.config.ts`. Default is `remix`.
- Build output goes to `build/` (this appears to be non-configurable).
- The Remix development environment runs on Vite and uses the `cloudflareDevProxyVitePlugin` plugin as configured in `vite.config.ts`, enabling execution of code that uses Cloudflare and Miniflare bundles.

## Merging the output of SSG and static part of SSR

- Merges the SSG generated content (`astro/dist/`) and the static part of SSR (`build/client/`) to deploy to server as static assets.
- Done by `merge` task.
- Output directory is `dist/`.

## Deploying

- `./task wrangler login` performs OAuth authentication to allow Wrangler CLI to operate on Cloudflare environments.
- There are two deployment environments: preview environment (`prev`) and production environment (`prod`).
- Task `prev:deploy` deploys to the Cloudflare Workers preview environment, while `prod:deploy` deploys to the production environment.
- Assets directory (`assets` in `wrangler.toml`) points to the output directory from merging above (`./dist`).

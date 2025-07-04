# Guide for Developers

## Running Tasks

- Running `./task` without argument shows available tasks/subcommands.
- Tasks `foo:bar` and `baz` are executed with `./task foo:bar baz[arg1,arg2]`. Arguments are passed in brackets.
- Task runner is written with shell script and the task `foo:bar` is implemented in shell script function `task_foo__bar`.
- Subcommand `qux` is executed as `./task qux arg1 arg2` and which is implemented as shell script function `subcmd_qux`.

## Development server

- `./task dev` launches development server.
- It launches Remix development server in background and launches Astro development server in foreground. The latter redirects access to dynamic paths to the former. This is configured in `astro/astro.config.ts`.

## Testing

- `./task test` runs Vitest test runner.
- Vitest runs in watch mode by default. If you would like to disable it, use `--run` option.

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
- Build output goes to `build/` (configured via `build.outDir` in `vite.config.ts`).

## Merging the output of SSG and static part of SSR

- Merges the SSG generated content (`astro/dist/`) and the static part of SSR (`build/client/`) to deploy to server as static assets.
- Done by `merge` task.
- Output directory is `dist/`.

## Deploying

- There are two deployment environments: preview environment (`prev`) and production environment (`prod`).
- Task `prev:deploy` to deploy to the Cloudflare Workers preview environment, while `prod:deploy` to production env.
- Assets directory (`assets` in `wrangler.toml`) points to the output directory from merging above (`./dist`).

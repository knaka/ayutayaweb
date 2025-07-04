<!-- +INCLUDE: DEVELOPMENT.md -->
# Guide for Developers

## Running Tasks

- Running `./task` without argument shows available tasks/subcommands.
- Tasks `foo:bar` and `baz` are executed with `./task foo:bar baz[arg1,arg2]`. Arguments are passed in brackets.
- Task runner is written with shell script and the task `foo:bar` is implemented in shell script function `task_foo__bar`.
- Subcommand `qux` is executed as `./task qux arg1 arg2` and which is implemented as shell script function `subcmd_qux`.

## Development server

- `./task dev` launches development server.
- Which launches Remix development server in background and launches Astro development server in front and the latter redirects access to dynamic paths to the former. It is configured in `ssg/astro.config.ts`.

## Testing

- `./task test` runs Vitest test runner.
- Vitest runs in watch mode by default. If you would like to disable it, use `--run` option.

## Astro application (SSG)

- The source directory is `ssg/`.
- Built with `astro:build` task.
- Contains static site generation (SSG) related files, components, and pages.
- The directory is pointed in `task-project.lib.sh` as `set_astro_project_dir "$PROJECT_DIR"/ssg`.
- Build output goes to `ssg/dist/` (configured via `outDir` in `ssg/astro.config.ts`).

## Remix application (SSR)

- The source directory is `app/`.
- Built with `remix:build` task.
- Contains React components, routes, and application logic.
- Uses Vite Compiler (not Remix Classic Compiler), configured via `vite.config.ts`.
- App directory configured via `appDirectory` option in `vite.config.ts`. Default is `app`.
- Build output goes to `build/` (configured via `build.outDir` in `vite.config.ts`).

## Merging the output of SSG and static part of SSR

- Merges the SSG generated content (`ssg/dist/`) and the static part of SSR (`build/client/`) to deploy to server as static assets.
- Done by `merge` task.
- Output directory is `dist/`.

## Deploying

- There are two deployment environments: preview environment (`prev`) and production environment (`prod`).
- Task `prev:deploy` to deploy to the Cloudflare Workers preview environment, while `prod:deploy` to production env.
- Assets directory (`assets` in `wrangler.toml`) points to the output directory from merging above (`./dist`).
<!-- +END -->

# Guide for Claude

## Documentation

- Written in simple, technical English.
- If there is an unnatural expression in the English text, correct it to a natural expression.
- If you find a sentence written in Japanese, translate it into English and replace it.
- When referencing tasks in documentation, use the task name (e.g., `astro:build`, `remix:build`, `merge`) rather than the implementation function name (e.g., `task_astro__build`, `task_remix__build`, `task_merge`).

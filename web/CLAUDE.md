<!-- +INCLUDE: DEVELOPMENT.md -->
<!-- Copied from https://github.com/knaka/src/blob/main/README.md -->

# Task Runner Written in Shell Script

## Running Tasks

* The task runner is invoked with `./task` on Linux and macOS, or `.\task.cmd` on Windows.
* On Windows, `task.cmd` installs BusyBox for Windows if not already installed and runs the scripts with it.
* Running `./task` without arguments shows available tasks/subcommands.
* Tasks `foo:bar` and `baz` are executed with `./task foo:bar baz[arg1,arg2]`. Arguments are passed in brackets.
* The task runner is written in shell script and the task `foo:bar` is implemented as the shell script function `task_foo__bar`.
* Subcommand `qux` is executed as `./task qux arg1 arg2` and is implemented as the shell script function `subcmd_qux`.

## Task Files and Directory Structure

* The entry point is `./task` on Linux and macOS, or `.\task.cmd` on Windows.
* Task files (`task.sh` and `task-*.lib.sh`) can be stored in the top directory of the project or in the `./tasks/` directory. All task script files should be placed in the same directory to ensure proper `source` functionality between scripts, so splitting them across directories is not recommended.
* Project-specific tasks/subcommands are defined in `project.lib.sh`, while other library tasks/subcommands are stored in `task-*.lib.sh` files.
* For subdirectories, the task runner supports subdirectory-specific project files using the pattern `<subdirectory-path>.project.lib.sh`. For example, tasks for the subdirectory `foo/bar/` would be defined in `foo.bar.project.lib.sh`.

## Shell Script Grammar

* The shell scripts should be executable with Bash, Dash, and BusyBox Ash.
* Therefore, the shell scripts should only use POSIX shell features.
* However, `local` variable declarations are not part of POSIX shell features, but they can be used as they are available in the shells listed above.

# Guide for Developers

## Development server

- `./task dev` launches development server.
- It launches the React Router development server in the background and launches the Astro development server in the foreground. The latter redirects access to dynamic paths to the former. This is configured in `astro/astro.config.ts`.

## Testing

- `./task test` runs the Vitest test runner.
- Vitest runs in watch mode by default. If you would like to disable it, use the `--run` option.

## React Router application (SSR)

- The source directory is `app/`.
- Because React Router needs to integrate with Cloudflare Workers, the React Router code cannot be moved to a subdirectory. Therefore, the project root serves as the React Router project directory.
- Built with `rr:build` task.
- Contains React components, routes, and application logic.
- Uses Vite and React Router, configured via `vite.config.ts` and `react-router.config.ts`.
- App directory is configured via the `appDirectory` option in `react-router.config.ts`. Set to `app`.
- Build output goes to `build/` (this appears to be non-configurable).
- The React Router development environment runs on Vite and uses the `cloudflare` plugin as configured in `vite.config.ts`, enabling execution of code that uses Cloudflare bundles.

## Database

- Uses Cloudflare's D1 database. For local development, it uses Miniflare's development D1 database.
- Database schema is defined in `db/schema.sql`. Use task `d1:local:migrate` for local database and `d1:prod:migrate` for production database schema migration. Schema migration uses sqldef, so there's no need to manage schema diffs manually.
- Database access code generation for TypeScript uses [sqlc](https://github.com/sqlc-dev/sqlc). Access queries are located in `db/queries/`. Task `db:gen` generates access code to `db/sqlcgen/`.

## Astro application (SSG)

- The source directory is `astro/`.
- Built with `astro:build` task.
- Contains static site generation (SSG) related files, components, and pages.
- The directory is referenced in `task-project.lib.sh` as `set_astro_project_dir "$PROJECT_DIR"/astro`.
- Build output goes to `astro/dist/` (configured via `outDir` in `astro/astro.config.ts`).

## Merging the output of SSG and static part of SSR

- Merges the SSG-generated content (`astro/dist/`) and the static part of SSR (`build/client/`) to deploy to the server as static assets.
- Done by the `merge` task.
- The output directory is `dist/`.

## Deploying

- `./task wrangler login` performs OAuth authentication to allow the Wrangler CLI to operate on Cloudflare environments.
- There are two deployment environments: the preview environment (`prev`) and the production environment (`prod`).
- Task `prev:deploy` deploys to the Cloudflare Workers preview environment, while `prod:deploy` deploys to the production environment.
- The assets directory (`assets` in `wrangler.toml`) points to the output directory from merging above (`./dist`).
<!-- +END -->

# Guide for Claude

## Documentation, Comments or strings in program code

- Written in simple, technical English.
- If there is an unnatural expression in the English text, correct it to a natural expression.
- If you find a sentence written in Japanese, translate it into English and replace it.
- When referencing tasks in documentation, use the task name (e.g., `astro:build`, `rr:build`, `merge`) rather than the implementation function name (e.g., `task_astro__build`, `task_rr__build`, `task_merge`).

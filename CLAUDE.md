# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test               # lint + unit tests (runs before every commit via Husky)
npm run test:unit      # unit tests only
npm run test:int       # integration tests (invokes handlers against AWS; requires deploy)
npm run test:e2e       # e2e tests (hits live API; requires deploy)
npm run deploy         # deploy to AWS via Serverless Framework (builds + pushes the image to ECR)
npm run lint           # eslint check
npm run lint:fix       # eslint auto-fix
npm run prettier       # format all files with prettier
```

To run a single test file:

```bash
npx jest path/to/test.file --config jest.config.js
```

## Architecture

This is the **Docker container image** counterpart to `javascript-template-sls` — same handler/test/CI
conventions, but the Lambda function is packaged as a container image (via `provider.ecr.images` in
`serverless.yml`) instead of a zip bundled by esbuild. `sls deploy` builds the image locally with Docker
and pushes it to ECR itself; no separate build step is needed in CI.

**Handler pattern:** identical to the zip template — `src/helloWorld.js` is wrapped with `@middy/core`
and logs via `@aws-lambda-powertools/logger`.

**Test layers:** identical to the zip template — `*.unit.test.js` (`jest.config.js`), `*.int.test.js`
(`jest.config.int.js`, invokes the handler directly), `*.e2e.test.js` (`jest.config.e2e.js`, hits the
deployed API via `axios`, reading the URL from CloudFormation outputs).

## Differences from `javascript-template-sls` (all required by the Docker packaging)

- **`Dockerfile`**: multi-stage build. The builder stage runs `npm ci --omit=dev --ignore-scripts` and
  copies `src/`; the final stage copies `package.json`, `node_modules`, and `src` into the Lambda base
  image. There's no esbuild step — the container ships the handler source and its runtime dependencies
  directly. `--ignore-scripts` is required here, not just good practice: without it, `npm ci` still runs
  the `prepare` lifecycle script (`husky`), but `--omit=dev` means `husky` itself was never installed, so
  the build fails with `husky: command not found`.
- **`"type": "module"` in `package.json`**: needed because there's no bundler to translate the handler's
  `import`/`export` syntax before it runs inside the container. Node's Lambda runtime needs to know the
  source is ESM — and it determines that by walking up from the loaded file looking for the _nearest_
  `package.json`, so that file must actually be copied into the final image (`${LAMBDA_TASK_ROOT}`), not
  just `node_modules`/`src`. Omitting it produces a confusing runtime error (`Cannot use import statement
outside a module`) rather than a build-time failure.
- **`serverless.yml`**: the `hello` function uses `image: { name: app_image }` instead of `handler:` +
  `build.esbuild`, and `provider.ecr.images.app_image.path` points at the repo root for the Docker build
  context.
- **No `provider.architecture: arm64`** (unlike the rest of the fleet): the container's CPU architecture
  is set by the platform Docker builds for, not by this Serverless Framework setting. Leaving it at the
  default (x86_64) avoids needing to pin `--platform` to match GitHub Actions' amd64 runners. Revisit if
  the fleet standardizes on arm64 container builds (e.g. via `docker buildx --platform linux/arm64`).

## Known constraints

- The Serverless Framework license key is pulled from AWS Secrets Manager via SSM (`/aws/reference/secretsmanager/serverless-framework-access-key`).
- Deploying requires Docker running locally (or, in CI, the GitHub Actions runner's preinstalled Docker daemon).

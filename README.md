# docker-as-lambda

Template for basic JavaScript serverless project deployed as a Docker container image, using Serverless Framework

Includes:

- Serverless Framework (ECR container image deploy)
- Jest
  - Jest-Extended
  - Jest Configs
  - Jest int/e2e Setup Files
- HelloWorld Lambda
- Placeholder unit test
- HelloWorld int test
- HelloWorld e2e test
- Middy core
- eslint
- prettier
- GitHub Actions script (CI)
- Husky pre-commit hooks
- Lint-staged
- Multi-stage Dockerfile (no bundler)

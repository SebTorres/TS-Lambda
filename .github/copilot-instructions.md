# Copilot Instructions for TS-Lambda (Coffee Shop API)

## Project Overview
- This repo demonstrates deploying AWS Lambda functions and DynamoDB using **TypeScript** via **Serverless Framework** and **AWS CDK**.
- Key directories:
  - `src/services/`: Lambda handlers (`createCoffee`, `getCoffee`, `updateCoffee`, `deleteCoffee`).
  - `src/infrastructure/`: CDK stacks and utilities.
  - `serverless.yml`: Serverless config.
  - `cdk.json`, `src/infrastructure/launcher.ts`: CDK entry/config.

## Architecture & Data Flow
- Each Lambda function in `src/services/` interacts with a DynamoDB table.
- Table schema and resource definitions are duplicated in both `serverless.yml` and CDK stacks (`src/infrastructure/stacks/`).
- API endpoints are provisioned via API Gateway (see `apiStack.ts`).
- Service boundaries: Each handler is single-responsibility (CRUD for coffee orders).

## Developer Workflows
- **Install dependencies:**
  ```zsh
  npm install
  ```
- **Deploy (Serverless):**
  ```zsh
  serverless deploy --stage dev
  ```
- **Deploy (CDK):**
  ```zsh
  cdk bootstrap   # first time only
  cdk deploy --all
  ```
- **Remove/Destroy:**
  ```zsh
  serverless remove --stage dev
  cdk destroy --all
  ```

## Conventions & Patterns
- Handlers expect event objects shaped for API Gateway proxy integration.
- DynamoDB access patterns are consistent: use AWS SDK v2, table name from env/config.
- Type definitions live in `src/types/`.
- Infrastructure code is modularized by stack (`apiStack.ts`, `databaseStack.ts`, `lambdaStack.ts`).
- Prefer explicit imports; avoid wildcard imports.

## Integration Points
- External: AWS Lambda, DynamoDB, API Gateway.
- Local: Shared utility functions in `src/infrastructure/utils.ts`.
- Environment variables for table names and config.

## Example: Adding a New Lambda
1. Create handler in `src/services/`.
2. Update `serverless.yml` and/or CDK stack to register function and permissions.
3. Add types to `src/types/` if needed.
4. Deploy using chosen method.

---
For questions or unclear conventions, check `Readme.md` or ask for clarification.

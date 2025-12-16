# Coffee Shop API Tutorial

This project demonstrates two popular ways to deploy AWS Lambda functions and DynamoDB using TypeScript: **Serverless Framework** and **AWS CDK**. It is designed as a hands-on tutorial for learning both approaches.

## Project Structure

- `src/services/` — Contains Lambda function handlers (TypeScript)
- `serverless.yml` — Serverless Framework configuration
- `cdk.json` & `src/infrastructure/launcher.ts` — AWS CDK configuration and entry point

## Prerequisites
- Node.js 20+ (recommended)
- AWS CLI configured
- Serverless Framework (`npm install -g serverless`)
- AWS CDK (`npm install -g aws-cdk`)

## 1. Deploying with Serverless Framework

1. Install dependencies:
   ```bash
   npm install
   ```
2. Deploy:
   ```bash
   serverless deploy --stage dev
   ```
3. Remove:
   ```bash
   serverless remove --stage dev
   ```

## 2. Deploying with AWS CDK

1. Install dependencies:
   ```bash
   npm install
   ```
2. Bootstrap your AWS environment (first time only):
   ```bash
   cdk bootstrap
   ```
3. Deploy:
   ```bash
   cdk deploy --all
   ```
4. Destroy:
   ```bash
   cdk destroy --all
   ```

## Lambda Functions
- **createCoffee**: Create a coffee order
- **getCoffee**: Retrieve coffee orders
- **updateCoffee**: Update order status
- **deleteCoffee**: Delete an order

All functions use DynamoDB for storage. The table is defined in both deployment methods.

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment. The pipeline automatically builds, tests, and deploys the Coffee Shop API to multiple environments.

### Pipeline Features

- **Automated Testing**: Mocha test suite with 80% coverage requirement
- **Code Quality**: ESLint validation and TypeScript compilation checks
- **Security Scanning**: npm audit for dependency vulnerabilities
- **Multi-Environment Deployment**: Automated deployment to dev, staging, and production
- **Manual Approvals**: Required gates for staging and production deployments
- **Post-Deployment Validation**: Smoke tests and health checks

### Workflow Stages

1. **Build & Lint**: Compiles TypeScript and runs ESLint
2. **Test**: Executes Mocha test suite with coverage reporting
3. **Security**: Scans for vulnerabilities (blocks on high/critical issues)
4. **Deploy Dev**: Auto-deploys to development on main branch push
5. **Deploy Staging**: Manual approval required after dev deployment
6. **Deploy Production**: Manual approval with additional validation

### Running Tests Locally

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration

# Run smoke tests
npm run test:smoke
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# TypeScript compilation check
npm run build
```

### GitHub Actions Setup

Required secrets and variables:
- `AWS_ROLE_DEV`: IAM role ARN for development deployment
- `AWS_ROLE_STAGING`: IAM role ARN for staging deployment
- `AWS_ROLE_PROD`: IAM role ARN for production deployment
- `AWS_REGION`: AWS region for deployments (e.g., us-east-1)

The pipeline uses OIDC for secure AWS authentication without storing credentials.

### Environment Configuration

The pipeline supports three environments:
- **Development**: Automatically deployed on every merge to main
- **Staging**: Requires manual approval, full test suite execution
- **Production**: Requires manual approval with additional validation gates

## Additional Resources
- [Serverless Framework Docs](https://www.serverless.com/framework/docs/)
- [AWS CDK Docs](https://docs.aws.amazon.com/cdk/latest/guide/home.html)

---

Feel free to explore both deployment methods and compare their workflows!

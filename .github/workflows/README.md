# GitHub Actions CI/CD Pipeline

This project uses GitHub Actions for continuous integration and continuous deployment.

## CI/CD Workflow

The workflow consists of the following jobs:

### 1. Test
- Runs the linting checks
- Executes all unit and integration tests
- Generates test coverage reports

### 2. Build
- Builds the production-ready application
- Creates optimized assets
- Uploads build artifacts for deployment

### 3. Security
- Runs dependency security scanning
- Performs static application security testing (SAST)
- Scans for code vulnerabilities

### 4. Deploy (Production)
- Deploys the application to the production environment
- Only runs on the main/master branch
- Uses Firebase Hosting for deployment

### 5. Deploy (Staging)
- Deploys the application to the staging environment
- Only runs on the develop branch
- Uses Firebase Hosting with a separate target

## Required Secrets

To use this workflow, you need to set up the following secrets in your GitHub repository:

- `FIREBASE_TOKEN`: Your Firebase CLI token for deployment

## Local Setup

To test the build and deployment locally:

1. Install Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize your project (if not already done):
   ```
   firebase init
   ```

4. Build your application:
   ```
   npm run build
   ```

5. Test the deployment locally:
   ```
   firebase serve
   ```

6. Deploy manually:
   ```
   firebase deploy
   ```

## Workflow Customization

You can customize the workflow by editing the `.github/workflows/ci-cd.yml` file.

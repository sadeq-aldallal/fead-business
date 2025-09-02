# Fead Business Infrastructure

This repository contains the AWS CDK infrastructure for the Fead Business Dashboard, implementing path-based routing with a single CloudFront distribution.

## Architecture Overview

### Path-Based Routing Strategy
- **Landing Page**: `https://dev.fead.app/` → `dev-fead.app-landing` S3 bucket
- **Business Dashboard**: `https://dev.fead.app/business/` → `dev-fead.app-business` S3 bucket
- **Single CloudFront Distribution**: Routes requests based on path patterns
- **Targeted Cache Invalidation**: Only `/business/*` paths are invalidated when business app changes

### Key Benefits
✅ **Independent Deployments**: Business changes don't affect landing page
✅ **Targeted Cache Invalidation**: Only business paths get cleared from cache  
✅ **Cost Effective**: Single CloudFront distribution for both apps
✅ **Microservice Architecture**: Each app has its own S3 bucket and deployment pipeline
✅ **No Client-Side Routing Conflicts**: Server-side routing handled by CloudFront

## Project Structure

```
fead-business-infrastructure/
├── lib/
│   └── fead-business-simple-stack.ts    # CDK stack for business S3 bucket
├── bin/
│   └── fead-business.ts                 # CDK app entry point  
├── deploy-business.sh                   # Complete deployment script
├── package.json                         # Dependencies & scripts
├── cdk.json                            # CDK configuration
└── tsconfig.json                       # TypeScript configuration
```

## Business App Changes Made

### 1. Base Path Configuration
- **Vite Config**: Set `base: '/business/'` for proper asset routing
- **React App**: Configured to work under `/business/` path
- **Authentication**: Stays within business context (no redirects to root)

### 2. Login System Improvements
- ✅ **Removed**: Previous login page that redirected to root
- ✅ **Restored**: Well-designed AuthModal with dark/light mode support
- ✅ **Modal Background**: Proper dark/light mode backgrounds (black/white)
- ✅ **Business Context**: Login modal shows at `/business/` instead of redirecting

### 3. Landing Page Integration
- ✅ **Get Started Button**: Now links to `/business/` with server-side routing
- ✅ **No Client Routing**: Uses `window.location.href` for proper CloudFront routing
- ✅ **Production Ready**: Works in both dev and production environments

## Deployment

### Quick Deploy
```bash
cd /home/sadeq/fead-workspace/fead-business-infrastructure
./deploy-business.sh
```

### Manual Steps
```bash
# 1. Build business app
cd ../fead-business
npm run build

# 2. Deploy infrastructure (S3 bucket)
cd ../fead-business-infrastructure
npm run build
npx cdk deploy

# 3. Update CloudFront distribution (automated in deploy-business.sh)
# - Add business origin: dev-fead.app-business.s3.amazonaws.com
# - Add cache behavior: /business/* → business origin
# - Configure SPA routing for business paths

# 4. Upload files and invalidate cache
aws s3 sync ../fead-business/dist s3://dev-fead.app-business --delete
aws cloudfront create-invalidation --distribution-id E3FT5O6TL4MEXM --paths "/business/*"
```

### Deployment Script Features
- ✅ **Complete Automation**: Handles all steps from build to cache invalidation
- ✅ **CloudFront Management**: Automatically updates distribution configuration
- ✅ **Error Handling**: Comprehensive error checking and rollback
- ✅ **Targeted Invalidation**: Only invalidates `/business/*` paths
- ✅ **Production Support**: Works with dev, staging, and production environments

## Expected Behavior

### User Flows
1. **Landing Page**: Visit `https://dev.fead.app/` → Marketing landing page
2. **Get Started**: Click "Get Started" → Navigates to `https://dev.fead.app/business/`
3. **Business Dashboard**: Visit `https://dev.fead.app/business/` → Business dashboard login
4. **Authentication**: Login modal appears (no redirect to root)
5. **Dashboard Access**: After login, access full business dashboard features

### Technical Implementation
- **Server-Side Routing**: CloudFront routes `/business/*` to business S3 bucket
- **SPA Support**: Business app handles internal routing via React Router  
- **Asset Loading**: All business assets load from `/business/` base path
- **Cache Isolation**: Business and landing caches are completely separate

## Infrastructure Outputs

After deployment, the following resources are created:

```yaml
BusinessBucketName: dev-fead.app-business
BusinessUrl: https://dev.fead.app/business
DistributionId: E3FT5O6TL4MEXM
CacheInvalidationCommand: aws cloudfront create-invalidation --distribution-id E3FT5O6TL4MEXM --paths "/business/*"
```

## Development Workflow

### Business App Changes
1. Make changes in `/home/sadeq/fead-workspace/fead-business/`
2. Run deployment: `./deploy-business.sh`
3. Business app updates automatically at `https://dev.fead.app/business/`
4. Landing page remains unaffected

### Landing Page Changes  
1. Make changes in `/home/sadeq/fead-workspace/fead-landing/`
2. Deploy landing infrastructure separately
3. Landing page updates at `https://dev.fead.app/`
4. Business app remains unaffected

## Monitoring & Troubleshooting

### Verify Deployment
```bash
# Check S3 bucket contents
aws s3 ls s3://dev-fead.app-business/ --recursive

# Check CloudFront distribution
aws cloudfront get-distribution --id E3FT5O6TL4MEXM

# Test business URL
curl -I https://dev.fead.app/business/
```

### Common Issues
1. **404 on /business/**: Verify CloudFront cache behavior is configured
2. **Assets not loading**: Check Vite `base` path configuration
3. **Login redirects to root**: Verify AuthModal is being used instead of redirect
4. **Cache not clearing**: Ensure invalidation targets `/business/*` paths

This architecture provides a clean separation between landing and business applications while maintaining a unified domain and efficient CDN usage.
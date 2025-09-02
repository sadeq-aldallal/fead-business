#!/bin/bash
# Fead Business Complete Deployment Script
# This script creates S3 bucket, updates CloudFront distribution, and deploys the business app
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Default values
STAGE="dev"
SKIP_BUILD=false
SKIP_INFRASTRUCTURE=false
DOMAIN="fead.app"

# Print usage
usage() {
    echo -e "${BLUE}Fead Business Complete Deployment Script${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -s, --stage STAGE             Deployment stage (dev, staging, prod) [default: dev]"
    echo "  -d, --domain DOMAIN           Domain name [default: fead.app]"
    echo "  --skip-build                 Skip React app build step"
    echo "  --skip-infrastructure        Skip CDK infrastructure deployment"
    echo "  -h, --help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                           # Full deployment to dev"
    echo "  $0 -s prod                   # Deploy to production"
    echo "  $0 --skip-build              # Skip React build, deploy existing dist/"
    echo "  $0 --skip-infrastructure     # Only build and deploy app, skip infrastructure"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -s|--stage)
            STAGE="$2"
            shift 2
            ;;
        -d|--domain)
            DOMAIN="$2"
            shift 2
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-infrastructure)
            SKIP_INFRASTRUCTURE=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            usage
            exit 1
            ;;
    esac
done

# Validate stage
if [[ ! "$STAGE" =~ ^(dev|staging|prod)$ ]]; then
    echo -e "${RED}Error: Stage must be one of: dev, staging, prod${NC}"
    exit 1
fi

# Configuration
BUSINESS_BUCKET="${STAGE}-${DOMAIN}-business"
LANDING_BUCKET="${STAGE}-${DOMAIN}-landing"
DISTRIBUTION_ID="E3FT5O6TL4MEXM" # Your existing distribution ID

# Print configuration
echo -e "${BLUE}====================================${NC}"
echo -e "${BLUE}  Fead Business Complete Deployment${NC}"
echo -e "${BLUE}====================================${NC}"
echo -e "${PURPLE}Stage:${NC}                $STAGE"
echo -e "${PURPLE}Domain:${NC}               $DOMAIN"
echo -e "${PURPLE}Business Bucket:${NC}      $BUSINESS_BUCKET"
echo -e "${PURPLE}Landing Bucket:${NC}       $LANDING_BUCKET"
echo -e "${PURPLE}Distribution ID:${NC}      $DISTRIBUTION_ID"
echo -e "${PURPLE}Skip Build:${NC}           $SKIP_BUILD"
echo -e "${PURPLE}Skip Infrastructure:${NC}  $SKIP_INFRASTRUCTURE"
echo ""

# Step 1: Build React application
if [ "$SKIP_BUILD" = false ]; then
    echo -e "${YELLOW}Step 1: Building React application...${NC}"
    cd ../fead-business
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo -e "${RED}Error: package.json not found in ../fead-business${NC}"
        exit 1
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing dependencies...${NC}"
        npm install
    fi
    
    # Build the application
    echo -e "${YELLOW}Running npm run build...${NC}"
    npm run build
    
    # Check if dist directory was created
    if [ ! -d "dist" ]; then
        echo -e "${RED}Error: Build failed - dist directory not found${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ React build completed successfully${NC}"
    cd ../fead-business-infrastructure
else
    echo -e "${YELLOW}Step 1: Skipping React build...${NC}"
    # Check if dist exists
    if [ ! -d "../fead-business/dist" ]; then
        echo -e "${RED}Error: ../fead-business/dist directory not found. Run without --skip-build first.${NC}"
        exit 1
    fi
fi

# Step 2: Deploy Infrastructure (S3 bucket)
if [ "$SKIP_INFRASTRUCTURE" = false ]; then
    echo ""
    echo -e "${YELLOW}Step 2: Deploying infrastructure (S3 bucket)...${NC}"
    npm run build
    
    echo -e "${YELLOW}Synthesizing CDK stack...${NC}"
    npx cdk synth -c stage="$STAGE" -c domain="$DOMAIN" -c existingDistributionId="$DISTRIBUTION_ID"
    
    echo -e "${YELLOW}Deploying S3 bucket to AWS...${NC}"
    npx cdk deploy \
        -c stage="$STAGE" \
        -c domain="$DOMAIN" \
        -c existingDistributionId="$DISTRIBUTION_ID" \
        --require-approval never
    
    echo -e "${GREEN}✅ Infrastructure deployed successfully${NC}"
else
    echo -e "${YELLOW}Step 2: Skipping infrastructure deployment...${NC}"
fi

# Step 3: Update CloudFront Distribution Configuration
echo ""
echo -e "${YELLOW}Step 3: Updating CloudFront distribution...${NC}"

# Get current distribution configuration
echo -e "${YELLOW}Getting current CloudFront distribution configuration...${NC}"
DIST_CONFIG=$(aws cloudfront get-distribution-config --id "$DISTRIBUTION_ID")
ETAG=$(echo "$DIST_CONFIG" | jq -r '.ETag')
CONFIG=$(echo "$DIST_CONFIG" | jq '.DistributionConfig')

echo -e "${YELLOW}Current ETag: $ETAG${NC}"

# Check if business origin already exists
BUSINESS_ORIGIN_EXISTS=$(echo "$CONFIG" | jq --arg bucket "$BUSINESS_BUCKET.s3.amazonaws.com" '.Origins.Items[] | select(.DomainName == $bucket) | length > 0')

if [ "$BUSINESS_ORIGIN_EXISTS" != "true" ]; then
    echo -e "${YELLOW}Adding business origin to CloudFront distribution...${NC}"
    
    # Add business origin
    UPDATED_CONFIG=$(echo "$CONFIG" | jq --arg bucket "$BUSINESS_BUCKET.s3.amazonaws.com" --arg originId "business-origin" '
        .Origins.Items += [{
            "Id": $originId,
            "DomainName": $bucket,
            "S3OriginConfig": {
                "OriginAccessIdentity": ""
            },
            "OriginAccessControlId": "E74FTE3AOVN9UA"
        }] | 
        .Origins.Quantity += 1
    ')
    
    # Add business cache behavior
    UPDATED_CONFIG=$(echo "$UPDATED_CONFIG" | jq --arg originId "business-origin" '
        .CacheBehaviors.Items += [{
            "PathPattern": "/business/*",
            "TargetOriginId": $originId,
            "ViewerProtocolPolicy": "redirect-to-https",
            "AllowedMethods": {
                "Quantity": 7,
                "Items": ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
                "CachedMethods": {
                    "Quantity": 2,
                    "Items": ["GET", "HEAD"]
                }
            },
            "Compress": true,
            "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
            "MinTTL": 0,
            "ForwardedValues": {
                "QueryString": false,
                "Cookies": {
                    "Forward": "none"
                }
            }
        }] |
        .CacheBehaviors.Quantity += 1
    ')
    
    # Save updated configuration to file
    echo "$UPDATED_CONFIG" > /tmp/distribution-config.json
    
    echo -e "${YELLOW}Updating CloudFront distribution with new configuration...${NC}"
    aws cloudfront update-distribution \
        --id "$DISTRIBUTION_ID" \
        --distribution-config file:///tmp/distribution-config.json \
        --if-match "$ETAG" \
        > /dev/null
    
    echo -e "${GREEN}✅ CloudFront distribution updated successfully${NC}"
    echo -e "${YELLOW}Note: CloudFront changes may take up to 15 minutes to propagate globally${NC}"
else
    echo -e "${YELLOW}Business origin already exists in CloudFront distribution${NC}"
fi

# Step 4: Deploy business application to S3
echo ""
echo -e "${YELLOW}Step 4: Deploying business application to S3...${NC}"

# Check if bucket exists
if aws s3 ls "s3://$BUSINESS_BUCKET" 2>/dev/null; then
    echo -e "${YELLOW}Syncing files to S3 bucket: $BUSINESS_BUCKET${NC}"
    aws s3 sync ../fead-business/dist s3://"$BUSINESS_BUCKET" --delete
    echo -e "${GREEN}✅ Files synced successfully${NC}"
else
    echo -e "${RED}Error: S3 bucket $BUSINESS_BUCKET does not exist${NC}"
    echo -e "${YELLOW}Please run the deployment without --skip-infrastructure first${NC}"
    exit 1
fi

# Step 5: Invalidate CloudFront cache for business paths
echo ""
echo -e "${YELLOW}Step 5: Creating CloudFront invalidation for /business/* paths...${NC}"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/business/*" \
    --query 'Invalidation.Id' \
    --output text)

echo -e "${GREEN}✅ Cache invalidation created: $INVALIDATION_ID${NC}"

# Check invalidation status
echo -e "${YELLOW}Checking invalidation status...${NC}"
INVALIDATION_STATUS=$(aws cloudfront get-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --id "$INVALIDATION_ID" \
    --query 'Invalidation.Status' \
    --output text)

echo -e "${GREEN}✅ Cache invalidation status: $INVALIDATION_STATUS${NC}"

# Final success message
echo ""
echo -e "${GREEN}🎉 Business deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}Deployment Summary:${NC}"
echo -e "${PURPLE}Stage:${NC}              $STAGE"
echo -e "${PURPLE}Business Bucket:${NC}    $BUSINESS_BUCKET"
echo -e "${PURPLE}Distribution ID:${NC}    $DISTRIBUTION_ID"
echo -e "${PURPLE}Invalidation ID:${NC}    $INVALIDATION_ID"
echo ""
echo -e "${YELLOW}Your business application is now available at:${NC}"
if [ "$STAGE" = "prod" ]; then
    echo -e "${GREEN}https://${DOMAIN}/business${NC}"
else
    echo -e "${GREEN}https://${STAGE}.${DOMAIN}/business${NC}"
fi
echo ""
echo -e "${YELLOW}Note: CloudFront changes may take up to 15 minutes to propagate globally${NC}"
echo -e "${BLUE}====================================${NC}"

# Cleanup
rm -f /tmp/distribution-config.json
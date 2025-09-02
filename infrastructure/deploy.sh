#!/bin/bash
# Fead Business Deployment Script
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
SKIP_DEPLOY=false
DOMAIN="fead.app"

# Print usage
usage() {
    echo -e "${BLUE}Fead Business Deployment Script${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -s, --stage STAGE          Deployment stage (dev, staging, prod) [default: dev]"
    echo "  -d, --domain DOMAIN        Domain name [default: fead.app]"
    echo "  --skip-build              Skip React app build step"
    echo "  --skip-deploy             Skip CDK deployment (build and sync only)"
    echo "  -h, --help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                        # Deploy to dev with React build"
    echo "  $0 -s prod               # Deploy to production"
    echo "  $0 --skip-build          # Skip React build, deploy existing dist/"
    echo "  $0 --skip-deploy         # Only build React app, don't deploy"
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
        --skip-deploy)
            SKIP_DEPLOY=true
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

# Print configuration
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Fead Business Deployment${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "${PURPLE}Stage:${NC}        $STAGE"
echo -e "${PURPLE}Domain:${NC}       $DOMAIN"
echo -e "${PURPLE}Skip Build:${NC}   $SKIP_BUILD"
echo -e "${PURPLE}Skip Deploy:${NC}  $SKIP_DEPLOY"
echo ""

# Build React application
if [ "$SKIP_BUILD" = false ]; then
    echo -e "${YELLOW}Building React application...${NC}"
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
    echo -e "${YELLOW}Skipping React build...${NC}"
    # Check if dist exists
    if [ ! -d "../fead-business/dist" ]; then
        echo -e "${RED}Error: ../fead-business/dist directory not found. Run without --skip-build first.${NC}"
        exit 1
    fi
fi

# Deploy infrastructure
if [ "$SKIP_DEPLOY" = false ]; then
    echo ""
    echo -e "${YELLOW}Building CDK application...${NC}"
    npm run build
    
    echo ""
    echo -e "${YELLOW}Synthesizing CDK stack...${NC}"
    npx cdk synth -c stage="$STAGE" -c domain="$DOMAIN"
    
    echo ""
    echo -e "${YELLOW}Deploying infrastructure to AWS...${NC}"
    npx cdk deploy \
        -c stage="$STAGE" \
        -c domain="$DOMAIN" \
        --require-approval never
    
    # Get stack outputs
    STACK_NAME="FeadBusinessCombined${STAGE^}Stack"
    echo ""
    echo -e "${YELLOW}Getting deployment outputs...${NC}"
    
    BUCKET_NAME=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --query 'Stacks[0].Outputs[?OutputKey==`BusinessBucketName`].OutputValue' \
        --output text 2>/dev/null || echo "")
    
    DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --query 'Stacks[0].Outputs[?OutputKey==`CombinedDistributionId`].OutputValue' \
        --output text 2>/dev/null || echo "")
    
    BUSINESS_URL=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --query 'Stacks[0].Outputs[?OutputKey==`BusinessUrl`].OutputValue' \
        --output text 2>/dev/null || echo "")
    
    if [ -n "$BUCKET_NAME" ] && [ -n "$DISTRIBUTION_ID" ]; then
        echo ""
        echo -e "${YELLOW}Syncing files to S3...${NC}"
        aws s3 sync ../fead-business/dist s3://"$BUCKET_NAME" --delete
        
        echo ""
        echo -e "${YELLOW}Creating CloudFront invalidation for business paths...${NC}"
        INVALIDATION_ID=$(aws cloudfront create-invalidation \
            --distribution-id "$DISTRIBUTION_ID" \
            --paths "/business/*" \
            --query 'Invalidation.Id' \
            --output text)
        
        echo -e "${GREEN}✅ Invalidation created: $INVALIDATION_ID${NC}"
        
        # Check invalidation status
        echo -e "${YELLOW}Checking invalidation status...${NC}"
        INVALIDATION_STATUS=$(aws cloudfront get-invalidation \
            --distribution-id "$DISTRIBUTION_ID" \
            --id "$INVALIDATION_ID" \
            --query 'Invalidation.Status' \
            --output text)
        
        echo -e "${GREEN}✅ Cache invalidation status: $INVALIDATION_STATUS${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Deployment Summary:${NC}"
    echo -e "${PURPLE}Stage:${NC}            $STAGE"
    [ -n "$BUCKET_NAME" ] && echo -e "${PURPLE}S3 Bucket:${NC}        $BUCKET_NAME"
    [ -n "$DISTRIBUTION_ID" ] && echo -e "${PURPLE}Distribution ID:${NC}  $DISTRIBUTION_ID"
    [ -n "$BUSINESS_URL" ] && echo -e "${PURPLE}Business App URL:${NC}  $BUSINESS_URL"
    [ -n "$INVALIDATION_ID" ] && echo -e "${PURPLE}Invalidation ID:${NC}  $INVALIDATION_ID"
    
    echo ""
    echo -e "${YELLOW}Your business application is now available at:${NC}"
    if [ -n "$BUSINESS_URL" ]; then
        echo -e "${GREEN}$BUSINESS_URL${NC}"
    else
        echo -e "${GREEN}https://${STAGE}.${DOMAIN}/business${NC}"
    fi
    
else
    echo ""
    echo -e "${GREEN}✅ Build completed (deployment skipped)${NC}"
fi

echo ""
echo -e "${BLUE}================================${NC}"
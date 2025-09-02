#!/bin/bash
# Fead Business Integrated Deployment Script
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
    echo -e "${BLUE}Fead Business Integrated Deployment Script${NC}"
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
    echo "  $0 --skip-infrastructure     # Only build and sync app, skip infrastructure"
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
DISTRIBUTION_ID="E16J5DW9T69CLY" # Your shared infrastructure distribution ID

# Print configuration
echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}  Fead Business Integrated Deployment${NC}"
echo -e "${BLUE}=====================================${NC}"
echo -e "${PURPLE}Stage:${NC}                $STAGE"
echo -e "${PURPLE}Domain:${NC}               $DOMAIN"
echo -e "${PURPLE}Business Bucket:${NC}      $BUSINESS_BUCKET"
echo -e "${PURPLE}Distribution ID:${NC}      $DISTRIBUTION_ID"
echo -e "${PURPLE}Skip Build:${NC}           $SKIP_BUILD"
echo -e "${PURPLE}Skip Infrastructure:${NC}  $SKIP_INFRASTRUCTURE"
echo ""

# Step 1: Build React application
if [ "$SKIP_BUILD" = false ]; then
    echo -e "${YELLOW}Step 1: Building React application...${NC}"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo -e "${RED}Error: package.json not found${NC}"
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
else
    echo -e "${YELLOW}Step 1: Skipping React build...${NC}"
    # Check if dist exists
    if [ ! -d "dist" ]; then
        echo -e "${RED}Error: dist directory not found. Run without --skip-build first.${NC}"
        exit 1
    fi
fi

# Step 2: Deploy Infrastructure (S3 bucket and cache behavior)
if [ "$SKIP_INFRASTRUCTURE" = false ]; then
    echo ""
    echo -e "${YELLOW}Step 2: Deploying infrastructure...${NC}"
    
    # Check if infrastructure directory exists
    if [ ! -d "infrastructure" ]; then
        echo -e "${RED}Error: infrastructure directory not found${NC}"
        exit 1
    fi
    
    cd infrastructure
    
    # Install infrastructure dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing infrastructure dependencies...${NC}"
        npm install
    fi
    
    echo -e "${YELLOW}Building CDK application...${NC}"
    npm run build
    
    echo -e "${YELLOW}Synthesizing CDK stack...${NC}"
    npx cdk synth -c stage="$STAGE" -c domain="$DOMAIN"
    
    echo -e "${YELLOW}Deploying infrastructure to AWS...${NC}"
    npx cdk deploy \
        -c stage="$STAGE" \
        -c domain="$DOMAIN" \
        --require-approval never
    
    cd ..
    echo -e "${GREEN}✅ Infrastructure deployed successfully${NC}"
else
    echo -e "${YELLOW}Step 2: Skipping infrastructure deployment...${NC}"
fi

# Step 3: Deploy business application to S3
echo ""
echo -e "${YELLOW}Step 3: Deploying business application to S3...${NC}"

# Check if bucket exists
if aws s3 ls "s3://$BUSINESS_BUCKET" >/dev/null 2>&1; then
    echo -e "${YELLOW}Syncing files to S3 bucket: $BUSINESS_BUCKET${NC}"
    aws s3 sync dist s3://"$BUSINESS_BUCKET" --delete
    echo -e "${GREEN}✅ Files synced successfully${NC}"
else
    echo -e "${RED}Error: S3 bucket $BUSINESS_BUCKET does not exist${NC}"
    echo -e "${YELLOW}Please run the deployment without --skip-infrastructure first${NC}"
    exit 1
fi

# Step 4: Invalidate CloudFront cache for business paths
echo ""
echo -e "${YELLOW}Step 4: Creating CloudFront invalidation for /business/* paths...${NC}"
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
echo -e "${BLUE}=====================================${NC}"
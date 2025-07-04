#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🚀 Stock Market App - Vercel Deployment${NC}"
echo -e "${PURPLE}=======================================${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install Vercel CLI${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Vercel CLI is ready${NC}"

# Check if user is logged in to Vercel
echo -e "${BLUE}🔐 Checking Vercel authentication...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}📝 Please log in to Vercel...${NC}"
    vercel login
fi

echo -e "${GREEN}✅ Vercel authentication confirmed${NC}"

# Build frontend
echo -e "${BLUE}🔨 Building frontend...${NC}"
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi
cd ..

echo -e "${GREEN}✅ Frontend built successfully${NC}"

# Commit any uncommitted changes
echo -e "${BLUE}📝 Checking for uncommitted changes...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Found uncommitted changes. Committing them...${NC}"
    git add .
    git commit -m "Pre-deployment commit: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin main
fi

# Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo -e "${BLUE}=======================================${NC}"
    echo -e "${GREEN}✅ Your app is now live on Vercel!${NC}"
    echo -e "${YELLOW}📋 Next steps:${NC}"
    echo -e "${YELLOW}1. Set up environment variables in Vercel dashboard${NC}"
    echo -e "${YELLOW}2. Configure MongoDB Atlas connection${NC}"
    echo -e "${YELLOW}3. Test your application thoroughly${NC}"
    echo -e "${BLUE}=======================================${NC}"
    echo -e "${GREEN}📚 Check VERCEL_DEPLOYMENT.md for detailed instructions${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    echo -e "${YELLOW}💡 Try running 'vercel' for troubleshooting${NC}"
    exit 1
fi

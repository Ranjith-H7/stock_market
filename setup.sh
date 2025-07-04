#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Stock Market Portfolio Trading App - Quick Start${NC}"
echo -e "${BLUE}=================================================${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v18+ first.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ is required. Current version: $(node --version)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB is installed${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not found locally. You'll need MongoDB Atlas or local MongoDB.${NC}"
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"

# Backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend dependency installation failed${NC}"
    exit 1
fi

# Frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend dependency installation failed${NC}"
    exit 1
fi

cd ..

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}📝 Creating backend .env file...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Created backend/.env file. Please edit it with your MongoDB URI.${NC}"
fi

# Build frontend for production
echo -e "${BLUE}🔨 Building frontend for production...${NC}"
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi
cd ..

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo -e "${BLUE}=================================================${NC}"
echo -e "${GREEN}🎉 Setup Complete! Here's what to do next:${NC}"
echo -e "${YELLOW}1. Edit backend/.env with your MongoDB connection string${NC}"
echo -e "${YELLOW}2. Start the backend: cd backend && npm start${NC}"
echo -e "${YELLOW}3. Start the frontend: cd frontend && npm run dev${NC}"
echo -e "${YELLOW}4. Visit http://localhost:5173 to see your app!${NC}"
echo -e "${BLUE}=================================================${NC}"
echo -e "${GREEN}📚 For detailed deployment instructions, see DEPLOYMENT.md${NC}"

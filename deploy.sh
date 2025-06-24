#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Build the application
echo "🔨 Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Check if .env files exist
if [ ! -f "server/.env" ]; then
    echo "⚠️  Warning: server/.env not found. Please create it with your MongoDB connection string."
fi

if [ ! -f "server/.env.production" ]; then
    echo "⚠️  Warning: server/.env.production not found. Please create it for production deployment."
fi

echo "🎉 Deployment preparation completed!"
echo ""
echo "Next steps:"
echo "1. For Heroku: git push heroku main"
echo "2. For Vercel: vercel"
echo "3. For Netlify: Connect your GitHub repo"
echo "4. For Docker: docker-compose up --build"
echo ""
echo "Don't forget to set your environment variables in your deployment platform!" 
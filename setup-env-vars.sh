#!/bin/bash

# Vercel Environment Variables Setup Script
# Run this script to set up environment variables for your Vercel deployment

echo "🚀 Setting up Vercel Environment Variables..."

# Set MongoDB URI
echo "📦 Setting MONGO_URI..."
npx vercel env add MONGO_URI production

# Set Node Environment
echo "🔧 Setting NODE_ENV..."
echo "production" | npx vercel env add NODE_ENV production

echo "✅ Environment variables setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Select your project: stock-market-app"
echo "3. Go to Settings → Environment Variables"
echo "4. Verify these variables are set:"
echo "   - MONGO_URI: mongodb+srv://ranjith360set:ranjith360set@cluster0.dssnbmo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
echo "   - NODE_ENV: production"
echo ""
echo "5. After setting variables, redeploy with: npx vercel --prod"

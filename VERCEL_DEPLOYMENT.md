# 🚀 Vercel Deployment Guide for Stock Market App

## Quick Deployment Steps

### 1. **Prepare Your Repository**
Make sure all your changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. **Deploy to Vercel**

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: stock-market-app
# - Deploy? Yes
```

#### Option B: Vercel Web Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `stock_market` repository
4. Configure the project:
   - **Project Name**: `stock-market-app`
   - **Framework Preset**: Other
   - **Root Directory**: `.` (root)
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`

### 3. **Environment Variables Setup**

In your Vercel dashboard, go to Project Settings → Environment Variables and add:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/stock_market
JWT_SECRET=your_super_secure_jwt_secret_key_here
NODE_ENV=production
```

**⚠️ Important**: Use MongoDB Atlas (cloud) for production, not local MongoDB.

### 4. **MongoDB Atlas Setup** (Required for Production)

1. **Create MongoDB Atlas Account**: Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. **Create a Cluster**: Choose the free tier
3. **Create Database User**:
   - Username: `stockmarket`
   - Password: Generate a secure password
4. **Whitelist IP Addresses**: Add `0.0.0.0/0` for Vercel (all IPs)
5. **Get Connection String**: 
   ```
   mongodb+srv://stockmarket:<password>@cluster0.xxxxx.mongodb.net/stock_market
   ```

### 5. **Update Your Domain**

After deployment, update the CORS configuration in your backend to include your Vercel domain:

1. Note your Vercel domain (e.g., `https://stock-market-app-xyz.vercel.app`)
2. The backend is already configured to accept Vercel domains

## 📁 Project Structure for Vercel

```
stock_market/
├── api/
│   └── index.js              # Serverless function entry point
├── backend/
│   ├── index.js              # Modified server for Vercel
│   ├── server.js             # Original server (for local dev)
│   ├── models/
│   ├── routes/
│   └── utils/
├── frontend/
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js        # API configuration
│   │   └── ...
│   ├── dist/                 # Build output
│   └── package.json
├── vercel.json               # Vercel configuration
└── package.json
```

## 🔧 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "name": "stock-market-app",
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm install --prefix backend && npm install --prefix frontend",
  "functions": {
    "api/index.js": {
      "maxDuration": 30
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/$1"
    }
  ]
}
```

### frontend/src/config/api.js
```javascript
const isDevelopment = import.meta.env.MODE === 'development';

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5001' 
  : window.location.origin;
```

## 🌐 How It Works

### Frontend
- **Build Process**: Vite builds the React app to `frontend/dist/`
- **Static Hosting**: Vercel serves static files from the dist directory
- **Routing**: Client-side routing handled by React Router

### Backend (Serverless Functions)
- **Entry Point**: `/api/index.js` handles all API requests
- **Database**: MongoDB Atlas with connection pooling
- **Routes**: All existing routes work under `/api/` prefix
- **CORS**: Configured for Vercel domains

### API Endpoints
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-app.vercel.app/api/*`

## 🚀 Deployment Commands

### Initial Deployment
```bash
vercel
```

### Production Deployment
```bash
vercel --prod
```

### Redeploy with Environment Variables
```bash
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel --prod
```

## 📊 Post-Deployment Checklist

### ✅ Test Your Deployment

1. **Visit your app**: `https://your-app.vercel.app`
2. **Test registration**: Create a new account
3. **Test login**: Sign in with your account
4. **Test trading**: Buy/sell some assets
5. **Check API health**: Visit `/api/health`

### 🔧 Common Issues & Solutions

#### Issue: "Cannot connect to database"
**Solution**: 
- Check MongoDB Atlas connection string
- Verify database user credentials
- Ensure IP whitelist includes `0.0.0.0/0`

#### Issue: "CORS errors"
**Solution**: 
- Backend is already configured for Vercel domains
- Make sure you're using the correct domain

#### Issue: "Build failed"
**Solution**:
```bash
# Test build locally first
cd frontend
npm run build

# Check for any build errors
npm run preview
```

#### Issue: "Serverless function timeout"
**Solution**: 
- Database operations are optimized for serverless
- Connection pooling is already configured
- Functions have 30-second timeout limit

## 🎯 Performance Optimization

### Frontend
- ✅ Static file caching via Vercel CDN
- ✅ Gzip compression enabled
- ✅ Tree shaking and code splitting

### Backend
- ✅ Connection pooling for MongoDB
- ✅ Serverless function optimization
- ✅ Efficient database queries

## 📈 Monitoring and Analytics

### Vercel Analytics
- Enable in Project Settings → Analytics
- Track page views, performance, and user behavior

### Function Logs
- View logs in Vercel Dashboard → Functions
- Monitor API performance and errors

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys!
```

## 🎉 Success!

Your Stock Market Portfolio Trading App is now live on Vercel! 

**Frontend**: `https://your-app.vercel.app`
**API**: `https://your-app.vercel.app/api/*`

---

**Need help?** Check the [Vercel Documentation](https://vercel.com/docs) or create an issue in your GitHub repository.

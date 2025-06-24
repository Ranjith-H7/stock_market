# 🆓 FREE Deployment Guide

Your portfolio management app can be deployed for **FREE** on multiple platforms. Choose the one that works best for you!

## 🥇 **Option 1: Render (Recommended)**

### Why Render?
- ✅ **Free tier**: 750 hours/month
- ✅ **No credit card required**
- ✅ **Perfect for full-stack apps**
- ✅ **Automatic deployments**

### Step-by-Step:
1. Go to [render.com](https://render.com)
2. Click "Get Started" → Sign up with GitHub
3. Click "New Web Service"
4. Connect your repo: `https://github.com/Ranjith-H7/stock_market.git`
5. Configure:
   - **Name**: `portfolio-management-app`
   - **Environment**: `Node`
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://350ranjith:350ranjith@cluster0.qt7ptsg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   NODE_ENV=production
   PORT=5001
   ```
7. Click "Create Web Service"
8. Wait 5-10 minutes for deployment
9. Your app will be live at: `https://your-app-name.onrender.com`

---

## 🥈 **Option 2: Railway**

### Why Railway?
- ✅ **Free tier**: $5 credit monthly
- ✅ **Very easy deployment**
- ✅ **Great for full-stack apps**

### Step-by-Step:
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo: `Ranjith-H7/stock_market`
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://350ranjith:350ranjith@cluster0.qt7ptsg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   NODE_ENV=production
   PORT=5001
   ```
6. Deploy automatically!

---

## 🥉 **Option 3: Vercel**

### Why Vercel?
- ✅ **Free tier**: Unlimited deployments
- ✅ **No credit card required**
- ✅ **Great performance**

### Step-by-Step:
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/build`
6. Add Environment Variables (same as above)
7. Deploy!

---

## 🏅 **Option 4: Netlify**

### Why Netlify?
- ✅ **Free tier**: 100GB bandwidth/month
- ✅ **No credit card required**
- ✅ **Great for frontend**

### Step-by-Step:
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Connect your repository
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
6. Deploy!

---

## 🚀 **Quick Start (Choose One)**

### For Full-Stack (Recommended):
**Use Render** - It's the easiest and most reliable for your app.

### For Frontend Only:
**Use Vercel or Netlify** - Great for just the React frontend.

### For Maximum Simplicity:
**Use Railway** - Very straightforward deployment.

---

## 📝 **Environment Variables**

All platforms need these environment variables:

```
MONGODB_URI=mongodb+srv://350ranjith:350ranjith@cluster0.qt7ptsg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
PORT=5001
```

---

## 🎯 **Recommended Choice**

**Start with Render** - it's free, easy, and perfect for your full-stack portfolio app!

Your app will be live in 10 minutes! 🎉 
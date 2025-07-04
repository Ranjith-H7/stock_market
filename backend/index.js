const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/assets');
const Asset = require('./models/Asset');
const User = require('./models/User');
const { dummyStocks, dummyMutualFunds } = require('./utils/DummyData');
require('dotenv').config();

const app = express();

// CORS configuration for Vercel
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-vercel-domain.vercel.app', // Replace with your actual domain
    /\.vercel\.app$/
  ],
  credentials: true
}));

app.use(express.json());

// MongoDB connection with connection pooling for serverless
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    });

    isConnected = db.connections[0].readyState;
    console.log('📦 Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// Initialize dummy data
const initializeAssets = async () => {
  try {
    const existingAssets = await Asset.find();
    if (existingAssets.length === 0) {
      const assets = [...dummyStocks, ...dummyMutualFunds];
      await Asset.insertMany(assets);
      console.log('🎯 Initial assets data created');
    }
  } catch (error) {
    console.error('❌ Error initializing assets:', error);
  }
};

// Update all users' portfolio profit/loss data
const updateAllUsersPortfolioData = async () => {
  try {
    console.log('🔄 Starting portfolio updates for all users...');
    const users = await User.find({}).populate('portfolio.assetId');
    let updatedUsersCount = 0;
    
    for (const user of users) {
      if (user.portfolio && user.portfolio.length > 0) {
        let hasChanges = false;
        
        // Filter out invalid portfolio items and recalculate
        const validPortfolio = user.portfolio.filter(item => item.assetId !== null);
        
        let totalInvested = 0;
        let currentValue = 0;
        
        validPortfolio.forEach(item => {
          if (item.assetId && item.assetId.price) {
            totalInvested += item.quantity * item.purchasePrice;
            currentValue += item.quantity * item.assetId.price;
          }
        });
        
        const profitLoss = currentValue - totalInvested;
        const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
        
        // Update user's calculated fields
        const previousProfitLoss = user.profitLoss || 0;
        user.totalInvested = parseFloat(totalInvested.toFixed(2));
        user.currentValue = parseFloat(currentValue.toFixed(2));
        user.profitLoss = parseFloat(profitLoss.toFixed(2));
        user.profitLossPercentage = parseFloat(profitLossPercentage.toFixed(2));
        user.portfolio = validPortfolio;
        user.lastUpdated = new Date();
        
        if (Math.abs(profitLoss - previousProfitLoss) > 0.01) {
          hasChanges = true;
        }
        
        if (hasChanges || user.isModified()) {
          await user.save();
          updatedUsersCount++;
        }
      } else {
        // Update timestamp even for users with no portfolio
        user.lastUpdated = new Date();
        await user.save();
      }
    }
    
    console.log(`✅ Updated portfolio data for ${updatedUsersCount} users with changes`);
  } catch (error) {
    console.error('❌ Error updating users portfolio data:', error);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', assetRoutes);

// Global variable to track the last update time
let lastUpdateTime = new Date();

// Update the lastUpdateTime when updates actually happen
const updateLastUpdateTime = () => {
  lastUpdateTime = new Date();
};

// Get next update time endpoint
app.get('/api/next-update', (req, res) => {
  const now = new Date();
  const nextUpdate = new Date(lastUpdateTime.getTime() + 10 * 60 * 1000); // 10 minutes from last update
  const secondsUntilUpdate = Math.max(0, Math.ceil((nextUpdate - now) / 1000));
  
  res.json({
    lastUpdate: lastUpdateTime,
    nextUpdate: nextUpdate,
    secondsUntilUpdate: secondsUntilUpdate
  });
});

// Manual update endpoint for testing
app.get('/api/update-all-portfolios', async (req, res) => {
  try {
    await connectToDatabase();
    await updateAllUsersPortfolioData();
    res.json({ message: 'All user portfolios updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update portfolios' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Initialize database connection and data
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    await initializeAssets();
    next();
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// For Vercel, we need to export the app as a serverless function
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🌟 Server running on port ${PORT}`);
  });
}

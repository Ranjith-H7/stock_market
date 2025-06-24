const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Asset = require('../models/Asset');

// Get system statistics
router.get('/', async (req, res) => {
  try {
    // Count users, portfolios, and assets
    const userCount = await User.countDocuments();
    const portfolioCount = await Portfolio.countDocuments();
    const assetCount = await Asset.countDocuments();
    
    // Count by asset type
    const stockCount = await Asset.countDocuments({ type: 'stock' });
    const mutualFundCount = await Asset.countDocuments({ type: 'mutual_fund' });
    
    // Calculate total portfolio value
    const portfolios = await Portfolio.find();
    const totalPortfolioValue = portfolios.reduce((sum, portfolio) => sum + portfolio.totalValue, 0);
    
    // Get highest and lowest priced assets
    const highestPricedStock = await Asset
      .find({ type: 'stock' })
      .sort({ currentPrice: -1 })
      .limit(1);
      
    const lowestPricedStock = await Asset
      .find({ type: 'stock' })
      .sort({ currentPrice: 1 })
      .limit(1);
      
    const stats = {
      userCount,
      portfolioCount,
      assetCount,
      assetTypes: {
        stocks: stockCount,
        mutualFunds: mutualFundCount
      },
      totalPortfolioValue,
      highestPricedStock: highestPricedStock[0] || null,
      lowestPricedStock: lowestPricedStock[0] || null,
      lastUpdated: new Date()
    };
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

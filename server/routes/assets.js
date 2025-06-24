const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const Portfolio = require('../models/Portfolio');

// Get all assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get asset by ID
router.get('/:id', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get assets by type
router.get('/type/:type', async (req, res) => {
  try {
    const assets = await Asset.find({ type: req.params.type });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create asset
router.post('/', async (req, res) => {
  const asset = new Asset({
    symbol: req.body.symbol,
    name: req.body.name,
    type: req.body.type,
    currentPrice: req.body.currentPrice,
    currency: req.body.currency || 'USD',
    dataSource: req.body.dataSource,
    priceHistory: [
      {
        price: req.body.currentPrice,
        timestamp: new Date()
      }
    ]
  });

  try {
    const newAsset = await asset.save();
    res.status(201).json(newAsset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update asset price
router.patch('/:id/price', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const oldPrice = asset.currentPrice;
    const newPrice = req.body.price;
    
    asset.currentPrice = newPrice;
    asset.priceHistory.push({
      price: newPrice,
      timestamp: new Date()
    });
    asset.lastUpdated = new Date();
    
    const updatedAsset = await asset.save();
    
    // Update all portfolios containing this asset
    const portfolios = await Portfolio.find({ 'holdings.assetId': asset._id });
    
    for (const portfolio of portfolios) {
      let totalValue = 0;
      for (const holding of portfolio.holdings) {
        const assetId = holding.assetId.toString();
        const currentAssetPrice = assetId === asset._id.toString() 
          ? newPrice 
          : (await Asset.findById(holding.assetId)).currentPrice;
          
        totalValue += holding.quantity * currentAssetPrice;
      }
      
      portfolio.totalValue = totalValue;
      portfolio.lastUpdated = new Date();
      await portfolio.save();
      
      // Emit update via socket.io
      const io = req.app.get('socketio');
      io.to(`user-${portfolio.userId}`).emit('portfolioUpdate', {
        portfolioId: portfolio._id,
        totalValue: portfolio.totalValue,
        assetUpdate: {
          assetId: asset._id,
          oldPrice,
          newPrice,
          percentChange: ((newPrice - oldPrice) / oldPrice) * 100
        }
      });
    }
    
    res.json(updatedAsset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete asset
router.delete('/:id', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    // Check if asset is used in any portfolio
    const portfolios = await Portfolio.find({ 'holdings.assetId': asset._id });
    if (portfolios.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete asset that is in use by portfolios',
        portfolios: portfolios.map(p => p._id)
      });
    }
    
    await Asset.deleteOne({ _id: req.params.id });
    res.json({ message: 'Asset deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

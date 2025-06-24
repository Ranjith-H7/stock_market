const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const Asset = require('../models/Asset');

// Get all portfolios for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.params.userId })
      .populate('holdings.assetId')
      .exec();
      
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get portfolio by ID
router.get('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id)
      .populate('holdings.assetId')
      .exec();
      
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Calculate current total value
    let totalValue = 0;
    for (const holding of portfolio.holdings) {
      totalValue += holding.quantity * holding.assetId.currentPrice;
    }
    
    portfolio.totalValue = totalValue;
    await portfolio.save();
    
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create portfolio
router.post('/', async (req, res) => {
  const portfolio = new Portfolio({
    userId: req.body.userId,
    name: req.body.name,
    holdings: req.body.holdings || []
  });

  try {
    // Calculate initial total value if there are holdings
    if (portfolio.holdings.length > 0) {
      let totalValue = 0;
      for (const holding of portfolio.holdings) {
        const asset = await Asset.findById(holding.assetId);
        if (asset) {
          totalValue += holding.quantity * asset.currentPrice;
        }
      }
      portfolio.totalValue = totalValue;
    }
    
    const newPortfolio = await portfolio.save();
    res.status(201).json(newPortfolio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update portfolio
router.patch('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    if (req.body.name) portfolio.name = req.body.name;
    if (req.body.holdings) portfolio.holdings = req.body.holdings;
    
    // Recalculate total value
    if (portfolio.holdings.length > 0) {
      let totalValue = 0;
      for (const holding of portfolio.holdings) {
        const asset = await Asset.findById(holding.assetId);
        if (asset) {
          totalValue += holding.quantity * asset.currentPrice;
        }
      }
      portfolio.totalValue = totalValue;
    }
    
    portfolio.lastUpdated = Date.now();
    
    const updatedPortfolio = await portfolio.save();
    res.json(updatedPortfolio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add holding to portfolio
router.post('/:id/holdings', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    const { assetId, quantity, purchasePrice } = req.body;
    
    // Check if asset exists
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    // Add holding
    portfolio.holdings.push({
      assetId,
      quantity,
      purchasePrice,
      purchaseDate: req.body.purchaseDate || new Date()
    });
    
    // Update total value
    let totalValue = 0;
    for (const holding of portfolio.holdings) {
      const asset = await Asset.findById(holding.assetId);
      if (asset) {
        totalValue += holding.quantity * asset.currentPrice;
      }
    }
    
    portfolio.totalValue = totalValue;
    portfolio.lastUpdated = Date.now();
    
    const updatedPortfolio = await portfolio.save();
    
    // Emit update via socket.io
    const io = req.app.get('socketio');
    io.to(`user-${portfolio.userId}`).emit('portfolioUpdate', {
      portfolioId: portfolio._id,
      totalValue: portfolio.totalValue
    });
    
    res.status(201).json(updatedPortfolio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove holding from portfolio
router.delete('/:portfolioId/holdings/:holdingId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    portfolio.holdings = portfolio.holdings.filter(
      holding => holding._id.toString() !== req.params.holdingId
    );
    
    // Recalculate total value
    let totalValue = 0;
    for (const holding of portfolio.holdings) {
      const asset = await Asset.findById(holding.assetId);
      if (asset) {
        totalValue += holding.quantity * asset.currentPrice;
      }
    }
    
    portfolio.totalValue = totalValue;
    portfolio.lastUpdated = Date.now();
    
    const updatedPortfolio = await portfolio.save();
    
    // Emit update via socket.io
    const io = req.app.get('socketio');
    io.to(`user-${portfolio.userId}`).emit('portfolioUpdate', {
      portfolioId: portfolio._id,
      totalValue: portfolio.totalValue
    });
    
    res.json(updatedPortfolio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete portfolio
router.delete('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    await Portfolio.deleteOne({ _id: req.params.id });
    res.json({ message: 'Portfolio deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

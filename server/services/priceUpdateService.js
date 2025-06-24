const Asset = require('../models/Asset');
const Portfolio = require('../models/Portfolio');
const mongoose = require('mongoose');

// Function to generate a realistic random price change (typically between -3% and +3%)
const generatePriceChange = (assetType) => {
  // Stocks tend to be more volatile than mutual funds
  if (assetType === 'stock') {
    return (Math.random() * 8 - 4) / 100; // -4% to +4% for stocks
  } else {
    return (Math.random() * 4 - 2) / 100; // -2% to +2% for mutual funds
  }
  
  // Occasionally generate more dramatic price changes (market events)
  if (Math.random() < 0.05) { // 5% chance of significant movement
    const direction = Math.random() > 0.5 ? 1 : -1;
    return direction * (Math.random() * 8 + 4) / 100; // +/- 4-12%
  }
};

// Update all asset prices with simulated data
const updateAssetPrices = async () => {
  try {
    // Get all assets
    const assets = await Asset.find();
    const updatedAssets = [];
    
    // Update each asset with a simulated price change
    for (const asset of assets) {
      // Calculate new price with a random change based on asset type
      const priceChange = generatePriceChange(asset.type);
      const newPrice = Math.max(0.01, asset.currentPrice * (1 + priceChange));
      const roundedPrice = Math.round(newPrice * 100) / 100; // Round to 2 decimal places
      
      // Update the asset
      asset.currentPrice = roundedPrice;
      asset.priceHistory.push({
        price: roundedPrice,
        timestamp: new Date()
      });
      asset.lastUpdated = new Date();
      
      // Keep price history manageable - limit to 100 entries per asset
      if (asset.priceHistory.length > 100) {
        asset.priceHistory = asset.priceHistory.slice(-100);
      }
      
      await asset.save();
      updatedAssets.push(asset);
    }
    
    // Update all portfolios
    await updateAllPortfolios();
    
    return updatedAssets;
  } catch (error) {
    console.error('Error updating asset prices:', error);
    throw error;
  }
};

// Update all portfolio values
const updateAllPortfolios = async () => {
  try {
    const portfolios = await Portfolio.find();
    
    for (const portfolio of portfolios) {
      let totalValue = 0;
      
      for (const holding of portfolio.holdings) {
        const asset = await Asset.findById(holding.assetId);
        if (asset) {
          totalValue += holding.quantity * asset.currentPrice;
        }
      }
      
      portfolio.totalValue = Math.round(totalValue * 100) / 100; // Round to 2 decimal places
      portfolio.lastUpdated = new Date();
      await portfolio.save();
    }
    
    return portfolios;
  } catch (error) {
    console.error('Error updating portfolios:', error);
    throw error;
  }
};

// Generate dummy data for the database
const generateDummyData = async () => {
  // List of stock symbols
  const stockSymbols = [
    'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 
    'TSLA', 'NVDA', 'JPM', 'V', 'JNJ',
    'WMT', 'PG', 'MA', 'UNH', 'HD',
    'BAC', 'XOM', 'CSCO', 'PFE', 'DIS'
  ];
  
  // List of mutual fund symbols
  const mutualFundSymbols = [
    'VFIAX', 'VTSAX', 'FXAIX', 'SWTSX', 'VTCLX',
    'VBTLX', 'VTIAX', 'FZROX', 'SWPPX', 'PRDGX',
    'FZILX', 'VWUSX', 'FCNTX', 'VWENX', 'VIGAX'
  ];
  
  // Create stocks
  for (let i = 0; i < stockSymbols.length; i++) {
    const basePrice = Math.random() * 500 + 50; // $50 to $550
    const price = Math.round(basePrice * 100) / 100;
    
    await Asset.create({
      symbol: stockSymbols[i],
      name: `${stockSymbols[i]} Stock`,
      type: 'stock',
      currentPrice: price,
      dataSource: 'dummy-stock-api',
      priceHistory: [{ price, timestamp: new Date() }]
    });
  }
  
  // Create mutual funds
  for (let i = 0; i < mutualFundSymbols.length; i++) {
    const basePrice = Math.random() * 200 + 80; // $80 to $280
    const price = Math.round(basePrice * 100) / 100;
    
    await Asset.create({
      symbol: mutualFundSymbols[i],
      name: `${mutualFundSymbols[i]} Fund`,
      type: 'mutual_fund',
      currentPrice: price,
      dataSource: 'dummy-fund-api',
      priceHistory: [{ price, timestamp: new Date() }]
    });
  }
  
  // Create users
  const users = [];
  for (let i = 1; i <= 250; i++) {
    const user = await mongoose.model('User').create({
      username: `user${i}`,
      email: `user${i}@example.com`,
      password: `password${i}`, // Would be hashed in a real app
      firstName: `First${i}`,
      lastName: `Last${i}`
    });
    
    users.push(user);
  }
  
  // Create portfolios (1-3 per user)
  const assets = await Asset.find();
  
  for (const user of users) {
    const portfolioCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 portfolios per user
    
    for (let i = 1; i <= portfolioCount; i++) {
      const portfolio = new mongoose.model('Portfolio')({
        userId: user._id,
        name: `Portfolio ${i}`,
        holdings: []
      });
      
      // Add 3-8 random holdings
      const holdingCount = Math.floor(Math.random() * 6) + 3;
      const selectedAssets = [...assets]; // Copy of assets array
      
      for (let j = 0; j < holdingCount; j++) {
        // Select a random asset and remove it from the array to avoid duplicates
        const randomIndex = Math.floor(Math.random() * selectedAssets.length);
        const asset = selectedAssets.splice(randomIndex, 1)[0];
        
        if (!asset) continue;
        
        const quantity = Math.floor(Math.random() * 100) + 1; // 1 to 100 units
        const purchasePrice = asset.currentPrice * (Math.random() * 0.4 + 0.8); // 80% to 120% of current price
        
        portfolio.holdings.push({
          assetId: asset._id,
          quantity,
          purchasePrice: Math.round(purchasePrice * 100) / 100,
          purchaseDate: new Date(Date.now() - Math.random() * 31536000000) // Random date within last year
        });
      }
      
      await portfolio.save();
    }
  }
  
  console.log('Dummy data generation complete');
};

module.exports = {
  updateAssetPrices,
  updateAllPortfolios,
  generateDummyData
};

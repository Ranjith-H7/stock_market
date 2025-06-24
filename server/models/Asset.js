const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['stock', 'mutual_fund']
  },
  currentPrice: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  priceHistory: [{
    price: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  dataSource: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Asset', AssetSchema);

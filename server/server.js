require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const path = require('path');

// Import routes
const userRoutes = require('./routes/users');
const portfolioRoutes = require('./routes/portfolios');
const assetRoutes = require('./routes/assets');
const statsRoutes = require('./routes/stats');

// Import data update service
const { updateAssetPrices } = require('./services/priceUpdateService');

// App setup
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-management')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('subscribe', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} subscribed to updates`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io accessible to other modules
app.set('socketio', io);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/stats', statsRoutes);

// Schedule price updates every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  console.log('Running scheduled task: Updating asset prices');
  const startTime = Date.now();
  try {
    const updatedAssets = await updateAssetPrices();
    
    // Calculate some statistics for the update
    let sumStockChange = 0;
    let stockCount = 0;
    let sumFundChange = 0;
    let fundCount = 0;
    
    updatedAssets.forEach(asset => {
      if (asset.priceHistory.length >= 2) {
        const currentPrice = asset.currentPrice;
        const previousPrice = asset.priceHistory[asset.priceHistory.length - 2].price;
        const change = ((currentPrice - previousPrice) / previousPrice) * 100;
        
        if (asset.type === 'stock') {
          sumStockChange += change;
          stockCount++;
        } else if (asset.type === 'mutual_fund') {
          sumFundChange += change;
          fundCount++;
        }
      }
    });
    
    const avgStockChange = stockCount > 0 ? (sumStockChange / stockCount).toFixed(2) : 0;
    const avgFundChange = fundCount > 0 ? (sumFundChange / fundCount).toFixed(2) : 0;
    
    // Emit price update with statistics
    io.emit('priceUpdate', { 
      timestamp: new Date(), 
      message: 'Prices updated',
      avgStockChange: `${avgStockChange}%`,
      avgFundChange: `${avgFundChange}%`
    });
    
    const executionTime = Date.now() - startTime;
    console.log(`Updated ${updatedAssets.length} assets in ${executionTime}ms`);
    console.log(`Average stock change: ${avgStockChange}%, Average fund change: ${avgFundChange}%`);
  } catch (error) {
    console.error('Error updating prices:', error);
  }
});

// API Root endpoint
app.get('/api', (req, res) => {
  res.send('Portfolio Management API');
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

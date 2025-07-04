# 📈 Stock Market Portfolio Trading App

A full-stack responsive web application for stock market portfolio management and trading simulation. Built with React, Node.js, Express, and MongoDB.

![Stock Market App](https://img.shields.io/badge/License-ISC-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![React](https://img.shields.io/badge/React-v18+-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green.svg)

## ✨ Features

### 🎯 **Core Trading Features**
- **Real-time Portfolio Management** - Track your investments in real-time
- **Buy/Sell Stocks & Mutual Funds** - Simulate trading with live price updates
- **Profit & Loss Tracking** - Real-time P&L calculations with percentage changes
- **Balance Management** - Add virtual money to your trading account
- **Transaction History** - Complete record of all buy/sell transactions

### 📱 **Responsive Design**
- **Mobile-First Design** - Optimized for all screen sizes
- **Cross-Device Compatibility** - Works seamlessly on mobile, tablet, laptop, and desktop
- **Touch-Friendly Interface** - 44px minimum touch targets for mobile accessibility
- **Responsive Charts** - Price trend graphs that adapt to screen size

### 📊 **Market Features**
- **Live Price Updates** - Prices update every 10 minutes automatically
- **Price Trend Charts** - Interactive charts with multiple view options (Line, Area, Volume)
- **Market Overview** - Browse all available stocks and mutual funds
- **Asset Information** - Detailed asset information with volume data

### 🔐 **User Management**
- **User Authentication** - Secure registration and login system
- **Portfolio Dashboard** - Personalized dashboard with portfolio summary
- **Profile Management** - Manage user information and account balance

## 🚀 Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **React Router** - Client-side routing
- **Recharts** - Interactive charts and graphs
- **Axios** - HTTP client for API calls

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **node-cron** - Scheduled tasks for price updates
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### **1. Clone the Repository**
```bash
git clone https://github.com/Ranjith-H7/stock_market.git
cd stock_market
```

### **2. Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB connection string
```

**Environment Variables (.env):**
```env
MONGO_URI=mongodb://localhost:27017/stock_market
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/stock_market
JWT_SECRET=your_jwt_secret_key_here
PORT=5001
```

**Start Backend Server:**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### **3. Frontend Setup**
```bash
cd ../frontend
npm install

# Start development server
npm run dev

# For production build
npm run build
```

## 🌐 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### **Portfolio Management**
- `GET /api/portfolio/:userId` - Get user portfolio
- `POST /api/buy` - Buy assets
- `POST /api/sell` - Sell assets
- `POST /api/add-balance` - Add money to account

### **Assets & Market Data**
- `GET /api/assets` - Get all available assets
- `GET /api/graphdata/:assetId` - Get price history for charts
- `GET /api/transactions/:userId` - Get user transaction history
- `GET /api/next-update` - Get next price update countdown

### **Automated Features**
- **Price Updates**: Every 10 minutes via cron job
- **Portfolio Recalculation**: Automatic P&L updates for all users
- **Real-time Data**: Live portfolio value updates

## 📱 Responsive Design Breakdown

### **Mobile (< 640px)**
- Single column layouts
- Stacked navigation
- Compressed cards and forms
- Touch-friendly buttons (44px min height)
- Horizontal scrolling tables

### **Tablet (640px - 1024px)**
- Two-column layouts
- Tab-based navigation
- Responsive grid systems
- Optimized chart sizes

### **Desktop (> 1024px)**
- Multi-column layouts (up to 4 columns)
- Full navigation menus
- Large interactive charts
- Maximum information density

## 🎨 Key Components

### **Dashboard**
- Portfolio summary cards
- Real-time profit/loss display
- Price trend charts
- Quick trading interface

### **Trading Interface**
- Asset selection grid
- Buy/sell forms with validation
- Transaction preview
- Real-time total calculations

### **Portfolio Management**
- Holdings table with P&L
- Transaction history
- Balance management
- Performance metrics

### **Market Overview**
- Stocks and mutual funds listing
- Price information
- Volume data
- Asset categories

## 🔄 Real-Time Features

### **Automatic Price Updates**
- Stocks: ±8% volatility every 10 minutes
- Mutual Funds: ±4% volatility every 10 minutes
- Volume fluctuations: ±20% variation
- Price history tracking (2000 data points)

### **Portfolio Calculations**
- Real-time profit/loss calculations
- Percentage change tracking
- Total invested vs current value
- Individual asset performance

## 🚀 Deployment

### **Frontend (Vite Build)**
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

### **Backend (Node.js)**
```bash
cd backend
npm start
# Deploy to services like Heroku, Railway, or DigitalOcean
```

### **Environment Setup for Production**
- Set up MongoDB Atlas for cloud database
- Configure CORS for production domains
- Set secure JWT secrets
- Use HTTPS in production

## 🛠️ Development Scripts

### **Backend**
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (auto-reload)
```

### **Frontend**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 📋 Future Enhancements

- [ ] Real stock market API integration
- [ ] Advanced charting with technical indicators
- [ ] Push notifications for price alerts
- [ ] Social features (following other traders)
- [ ] Advanced order types (limit, stop-loss)
- [ ] Mobile app development
- [ ] Real-time WebSocket price updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ranjith H**
- GitHub: [@Ranjith-H7](https://github.com/Ranjith-H7)

## 🙏 Acknowledgments

- MongoDB for the robust NoSQL database
- React team for the amazing frontend framework
- Tailwind CSS for the utility-first CSS framework
- Recharts for beautiful and responsive charts
- Express.js for the minimal web framework

---

**⭐ If you found this project helpful, please give it a star!**

# Stock Market Trading Application

A comprehensive full-stack stock market trading application with real-time data, advanced charts, and portfolio management.

## 🚀 Features

### 🏠 Dashboard
- **Real-time Price Updates**: Prices update every 10 minutes with countdown timer
- **Financial Summary**: View balance, total invested, current value, and profit/loss
- **Portfolio Management**: Track your holdings with real-time P&L calculations
- **User-friendly Interface**: Clean, responsive design with Tailwind CSS

### 📊 Advanced Charts & Visualization
- **Multiple Chart Types**: Line charts, Area charts, and Volume charts
- **Interactive Graphs**: Switch between different chart views with buttons
- **Real-time Data**: Charts update automatically with new price data
- **Historical Data**: View 24 hours of price history (every 10 minutes)
- **Responsive Charts**: Built with Recharts library

### 👤 User Profile & Management
- **Personal Information**: Display username and email in header
- **Detailed Portfolio Analysis**: Complete breakdown of holdings with individual P&L
- **Transaction History**: Complete record of all buy/sell transactions
- **Financial Metrics**: Real-time profit/loss calculations with percentages

### 🔐 Authentication & Security
- **User Registration**: Create account with username, email, and password
- **Secure Login**: Session management with localStorage
- **Profile Management**: View and manage user information

### 💹 Trading Features
- **Buy/Sell Assets**: Trade stocks and mutual funds with real-time pricing
- **Portfolio Tracking**: Monitor investments with live P&L calculations
- **Balance Management**: Track available balance and invested amounts
- **Transaction Logging**: Complete audit trail of all trades

## 🛠 Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Recharts**: Chart library for data visualization
- **Axios**: HTTP client for API communication
- **React Router DOM**: Client-side routing

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **node-cron**: Scheduled tasks for automatic price updates
- **CORS**: Cross-origin resource sharing middleware

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/stock_market
   PORT=5001
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## 🎯 Usage Guide

### Getting Started
1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your portfolio and market data
4. **Profile**: Access detailed portfolio analysis and transaction history

### Trading
1. **View Assets**: Browse available stocks and mutual funds
2. **Buy Assets**: Purchase assets using your balance (₹1,00,000 starting balance)
3. **Sell Assets**: Sell holdings from your portfolio
4. **Track Performance**: Monitor real-time profit/loss

### Charts & Analysis
1. **Price Trends**: View real-time price charts for all assets
2. **Chart Types**: Switch between Line, Area, and Volume charts
3. **Historical Data**: Analyze price movements over time

## 🗄 Database Schema

### User Model
```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (required),
  balance: Number (default: 100000),
  portfolio: [{
    assetId: ObjectId (ref: 'Asset'),
    quantity: Number,
    purchasePrice: Number
  }],
  timestamps: true
}
```

### Asset Model
```javascript
{
  name: String,
  symbol: String,
  type: String, // 'stock' or 'mutualFund'
  price: Number,
  volume: Number,
  priceHistory: [{
    price: Number,
    volume: Number,
    timestamp: Date
  }]
}
```

### Transaction Model
```javascript
{
  userId: ObjectId (ref: 'User'),
  assetId: ObjectId (ref: 'Asset'),
  type: String, // 'buy' or 'sell'
  quantity: Number,
  price: Number,
  timestamp: Date (default: Date.now),
  timestamps: true
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Portfolio & Trading
- `GET /api/assets` - Get all available assets
- `GET /api/portfolio/:userId` - Get user portfolio with P&L calculations
- `POST /api/buy` - Buy assets
- `POST /api/sell` - Sell assets

### Analytics & History
- `GET /api/transactions/:userId` - Get user transaction history
- `GET /api/graphdata/:assetId` - Get price history for charts

## 📊 Available Assets

### Stocks
- TCS (₹4,000)
- Reliance (₹3,000)
- Infosys (₹1,800)
- HDFC (₹2,500)
- Tata Steel (₹1,200)

### Mutual Funds
- SBI Bluechip (₹500)
- ICICI Equity (₹600)
- Axis MF (₹450)
- Kotak MF (₹700)

## ⚡ Key Features Implemented

### Real-time Updates
- Automatic price updates every 10 minutes using node-cron
- Live countdown timer showing next update
- Real-time P&L calculations across portfolio

### Advanced Charting
- Multiple chart types with easy switching
- Responsive design for all screen sizes
- Historical price data visualization
- Volume analysis charts

### Portfolio Management
- Comprehensive portfolio tracking
- Individual asset P&L calculations
- Total portfolio performance metrics
- Transaction history with detailed records

### User Experience
- Intuitive navigation between Dashboard and Profile
- Responsive design for mobile and desktop
- Real-time feedback on trades
- Clean, modern interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Common Issues

1. **Charts not showing**: Make sure backend is running and price history is populated
2. **Login issues**: Check if MongoDB is running and connected
3. **Price updates not working**: Verify node-cron is properly configured

### Support

For support and questions:
- Open an issue in the repository
- Check the console for error messages
- Ensure all dependencies are properly installed

## 🎨 Screenshots

*Add screenshots of your application here showing:*
- Dashboard with portfolio
- Interactive charts
- User profile
- Trading interface

---

**Made with ❤️ using React, Node.js, and MongoDB**

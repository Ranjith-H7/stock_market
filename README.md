# Stock Market Portfolio Application

A full-stack web application for managing stock market portfolios with real-time price updates.

## Features

- User authentication (Register/Login)
- Portfolio management
- Buy/Sell stocks and mutual funds
- Real-time price updates every 10 minutes
- Interactive price charts
- Dashboard with portfolio overview

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- CORS enabled
- Cron jobs for price updates
- RESTful API

### Frontend
- React 18
- Vite for development
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Recharts for data visualization

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd /Users/ranjith/Documents/jsProjects/stock_market
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:5001`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application will be available on `http://localhost:5173`

### Environment Variables

The backend requires a `.env` file with:
```
MONGO_URI=mongodb+srv://ranjith360set:ranjith360set@cluster0.dssnbmo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Assets & Portfolio
- `GET /api/assets` - Get all available assets
- `GET /api/portfolio/:userId` - Get user portfolio
- `POST /api/buy` - Buy assets
- `POST /api/sell` - Sell assets
- `GET /api/graphdata/:assetId` - Get price history for charts

## Default Assets

The application includes dummy data for:

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

## Features in Detail

### Price Updates
- Automatic price updates every 10 minutes using cron jobs
- Random price fluctuations between -5% to +5%
- Price history tracking for charts

### Portfolio Management
- Starting balance: ₹100,000
- Buy/Sell functionality with real-time balance updates
- Profit/Loss calculation
- Quantity tracking

### User Interface
- Responsive design with Tailwind CSS
- Real-time countdown timer for next price update
- Interactive charts showing price trends
- Clean and modern dashboard

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **View Dashboard**: See your portfolio balance and holdings
3. **Buy Assets**: Select assets from the dropdown and specify quantity
4. **Sell Assets**: Sell your holdings when profitable
5. **Monitor Trends**: View price charts to make informed decisions

## Development

The application uses:
- Hot reloading for both frontend and backend
- Nodemon for backend auto-restart
- Vite for fast frontend development
- Tailwind CSS for rapid styling

## Notes

- Prices update automatically every 10 minutes
- All monetary values are in Indian Rupees (₹)
- Price history is maintained for charting
- User data persists in MongoDB
# Portfolio Management App

A full-stack portfolio management application with real-time updates, built with React, Node.js, Express, and MongoDB.

## Features

- Real-time portfolio tracking
- Asset price updates
- Interactive charts and analytics
- User management
- Responsive design
- WebSocket integration for live updates

## Tech Stack

- **Frontend**: React, Chart.js, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB
- **Real-time**: WebSocket connections
- **Styling**: CSS3 with responsive design

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ranjith-H7/stock_market.git
cd stock_market
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
   - Copy `server/.env.example` to `server/.env`
   - Update the MongoDB connection string

4. Start the development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## Deployment Options

### 1. Heroku Deployment

1. Install Heroku CLI and login:
```bash
heroku login
```

2. Create a new Heroku app:
```bash
heroku create your-app-name
```

3. Set environment variables:
```bash
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set NODE_ENV=production
```

4. Deploy:
```bash
git push heroku main
```

### 2. Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

### 3. Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `client/build`
3. Set environment variables in Netlify dashboard

### 4. Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. Or build and run individual containers:
```bash
docker build -t portfolio-app .
docker run -p 5001:5001 portfolio-app
```

### 5. Railway Deployment

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5001
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.com
JWT_SECRET=your-secret-key
```

## API Endpoints

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/portfolios` - Get all portfolios
- `POST /api/portfolios` - Create a new portfolio
- `GET /api/assets` - Get all assets
- `POST /api/assets` - Create a new asset
- `GET /api/stats` - Get portfolio statistics

## WebSocket Events

- `subscribe` - Subscribe to user updates
- `priceUpdate` - Real-time price updates
- `portfolioUpdate` - Portfolio changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@example.com or create an issue in the repository.

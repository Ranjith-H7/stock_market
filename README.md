# Portfolio Management Application

A real-time portfolio management application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to view and monitor their financial assets (stocks and mutual funds) with real-time updates.

## Features

- User selection from 250 predefined users
- Real-time portfolio updates via WebSockets
- Display of stocks and mutual funds with current prices
- Price updates every 10 minutes
- Portfolio valuation and profit/loss tracking
- Price history visualization with charts

## Technical Stack

- **Frontend**: React, Chart.js, Socket.io-client
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Real-time Updates**: Socket.io
- **Scheduled Tasks**: node-cron

## Project Structure

```
portfolio-management-app/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── context/         # React context providers
│       ├── pages/           # Main application pages
│       ├── App.js           # Main application component
│       └── index.js         # Entry point
│
└── server/                  # Node.js backend
    ├── models/              # MongoDB schemas
    ├── routes/              # API endpoints
    ├── services/            # Business logic services
    ├── server.js            # Server entry point
    └── seedDatabase.js      # Database seeding script
```

## Setup and Installation

### Prerequisites

- Node.js (v14 or later)
- MongoDB (running locally or accessible via connection string)

### Server Setup

1. Navigate to the server directory:
   ```
   cd portfolio-management-app/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/portfolio-management
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. Seed the database with dummy data:
   ```
   node seedDatabase.js
   ```

5. Start the server:
   ```
   npm start
   ```

### Client Setup

1. Navigate to the client directory:
   ```
   cd portfolio-management-app/client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

4. Access the application at [http://localhost:3000](http://localhost:3000)

## Usage

1. Select a user from the user selection screen
2. View the user's portfolios on the dashboard
3. Click on a portfolio to see detailed holdings and performance
4. Watch as prices automatically update every 10 minutes

## Data Model

- **Users**: Basic user information
- **Assets**: Stocks and mutual funds with price history
- **Portfolios**: Collections of assets owned by users, with purchase data and current valuation

## Price Updates

The application simulates price changes every 10 minutes using the node-cron scheduler. In a production environment, this would be replaced with real market data from financial APIs.

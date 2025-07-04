# 🚀 Deployment Guide

## Quick Start (Development)

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Git

### 1. Clone and Setup
```bash
git clone https://github.com/Ranjith-H7/stock_market.git
cd stock_market

# Install dependencies for both frontend and backend
npm run install-all

# Or install individually:
# npm run install-backend
# npm run install-frontend
```

### 2. Environment Setup
```bash
# Backend environment
cd backend
cp .env.example .env

# Edit .env with your MongoDB URI:
# MONGO_URI=mongodb://localhost:27017/stock_market
# JWT_SECRET=your_secure_jwt_secret_here
```

### 3. Start Development
```bash
# Start both frontend and backend (from root directory)
npm start

# Or start individually:
# npm run start-backend    # Backend on port 5001
# npm run start-frontend   # Frontend on port 5173
```

## Production Deployment

### Option 1: Traditional Hosting (VPS/EC2)

#### Backend Deployment
```bash
# On your server
git clone https://github.com/Ranjith-H7/stock_market.git
cd stock_market/backend
npm install --production

# Setup environment variables
nano .env
# Add production MongoDB URI and JWT secret

# Start with PM2 (recommended)
npm install -g pm2
pm2 start server.js --name "stock-market-backend"
pm2 startup
pm2 save
```

#### Frontend Deployment
```bash
# Build for production
cd ../frontend
npm install
npm run build

# Deploy the 'dist' folder to your web server
# Example for Nginx:
sudo cp -r dist/* /var/www/html/
```

### Option 2: Platform-as-a-Service

#### Backend (Railway/Heroku)
1. Create new project on Railway/Heroku
2. Connect your GitHub repository
3. Set environment variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secure random string
   - `PORT`: 5001 (or let platform assign)
4. Deploy from main branch

#### Frontend (Vercel/Netlify)
1. Create new project on Vercel/Netlify
2. Connect your GitHub repository
3. Set build settings:
   - Build command: `cd frontend && npm run build`
   - Output directory: `frontend/dist`
4. Deploy from main branch

### Option 3: Docker Deployment

#### Create Dockerfile for Backend
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

#### Create Dockerfile for Frontend
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      - MONGO_URI=mongodb://mongo:27017/stock_market
      - JWT_SECRET=your_jwt_secret_here
    depends_on:
      - mongo
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
  
  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## Environment Variables

### Backend (.env)
```env
# Database
MONGO_URI=mongodb://localhost:27017/stock_market

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_change_this_in_production

# Server
PORT=5001
NODE_ENV=production

# CORS (for production)
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (Environment Variables)
```env
# If using different API URL in production
VITE_API_URL=https://your-backend-domain.com
```

## Database Setup

### MongoDB Atlas (Recommended for Production)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create new cluster
3. Add database user
4. Whitelist IP addresses
5. Get connection string
6. Replace in your .env file

### Local MongoDB
```bash
# Install MongoDB locally
brew install mongodb-community@6.0  # macOS
sudo apt install mongodb           # Ubuntu

# Start MongoDB
brew services start mongodb-community@6.0  # macOS
sudo systemctl start mongod                # Ubuntu
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Performance Optimization

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement caching headers

### Backend
- Enable compression middleware
- Use Redis for session storage
- Implement rate limiting

### Database
- Create indexes for frequently queried fields
- Use connection pooling
- Regular database maintenance

## Monitoring and Logging

### Backend Logging
```javascript
// Add to server.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Checks
```javascript
// Add to server.js
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

## Backup Strategy

### Database Backup
```bash
# Daily backup script
#!/bin/bash
mongodump --host localhost:27017 --db stock_market --out /backups/$(date +%Y%m%d)

# Keep only last 7 days
find /backups -type d -mtime +7 -exec rm -rf {} \;
```

## Common Issues and Solutions

### CORS Issues
```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### MongoDB Connection Issues
- Check firewall settings
- Verify connection string
- Ensure MongoDB is running
- Check authentication credentials

### Build Issues
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify all dependencies are installed

## Support

If you encounter issues:
1. Check the GitHub Issues page
2. Review the logs for error messages
3. Ensure all environment variables are set correctly
4. Verify database connectivity

---

**🎉 Your Stock Market Portfolio Trading App is now ready for production!**

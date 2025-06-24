# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm run install-all

# Copy source code
COPY . .

# Build the client
RUN npm run build

# Expose port
EXPOSE 5001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5001

# Start the application
CMD ["npm", "start"] 
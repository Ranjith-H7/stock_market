require('dotenv').config();
const mongoose = require('mongoose');

// Import models (this is needed before using them in generateDummyData)
require('./models/User');
require('./models/Asset');
require('./models/Portfolio');

const { generateDummyData } = require('./services/priceUpdateService');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-management')
  .then(() => {
    console.log('Connected to MongoDB');
    return seedDatabase();
  })
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    process.exit(1);
  });

// Seed the database with dummy data
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    await mongoose.connection.db.dropDatabase();
    console.log('Dropped old database');
    
    // Generate new data
    await generateDummyData();
    
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

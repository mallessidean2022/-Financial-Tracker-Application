const mongoose = require('mongoose');

/**
 * Configure Mongoose settings
 */
const configureMongoose = () => {
  // Set Mongoose options
  mongoose.set('strictQuery', false);
  
  // Connection event handlers
  mongoose.connection.on('connected', () => {
    console.log('✓ Mongoose connected to MongoDB');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('✗ Mongoose connection error:', err);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('✗ Mongoose disconnected from MongoDB');
  });
  
  // Handle application termination
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to application termination');
    process.exit(0);
  });
};

/**
 * Connect to MongoDB
 */
const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri || process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    return mongoose.connection;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = { configureMongoose, connectDB };

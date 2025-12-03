// Script to set a user as administrator
// Run this after creating the admin@demo.com account
// Usage: node setAdmin.js

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function setAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Update the admin@demo.com user to have admin role
    const user = await User.findOneAndUpdate(
      { email: 'admin@demo.com' },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log('✓ User successfully set as administrator!');
      console.log('┌────────────────────────────────┐');
      console.log('│  Admin Account Updated:        │');
      console.log('├────────────────────────────────┤');
      console.log('│  Email:    admin@demo.com      │');
      console.log('│  Username:', user.username.padEnd(21), '│');
      console.log('│  Role:     admin               │');
      console.log('└────────────────────────────────┘');
      console.log('\n✅ You can now login and see the Admin Panel button!');
    } else {
      console.log('❌ User with email admin@demo.com not found');
      console.log('Please register the user first, then run this script.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating user:', error.message);
    console.error('\nPossible solutions:');
    console.error('1. Make sure backend server is NOT running (stop it first)');
    console.error('2. Check your .env file has correct MONGODB_URI');
    console.error('3. Verify you have internet connection');
    process.exit(1);
  }
}

setAdmin();

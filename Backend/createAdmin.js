// Quick script to create an admin user
// Run this ONCE to create your first admin

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@demo.com' });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@demo.com',
      username: 'adminuser',
      password: 'Admin123',
      role: 'admin'
    });

    console.log('✓ Admin user created successfully!');
    console.log('┌────────────────────────────────┐');
    console.log('│  Admin Login Credentials:     │');
    console.log('├────────────────────────────────┤');
    console.log('│  Email:    admin@demo.com      │');
    console.log('│  Username: adminuser           │');
    console.log('│  Password: Admin123            │');
    console.log('└────────────────────────────────┘');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();

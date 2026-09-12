require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

async function seed() {
  await connectDB();

  const existing = await User.findOne({ email: 'admin@mlm.com' });
  if (existing) {
    console.log('Admin already exists.');
    process.exit(0);
  }

  const admin = new User({
    name: 'Amrut Admin',
    email: 'admin@mlm.com',
    role: 'super_admin',
    rank: 'L9',
  });
  await admin.setPassword('admin@123');
  await admin.save();

  console.log('Seeded super_admin: admin@mlm.com / admin@123');
  process.exit(0);
}

seed();
require('dotenv').config();
const connectDB = require('../config/db');
const Property = require('../models/Property');

const PROPERTIES = [
  {
    title: 'Riverside Plots, Phase 2',
    category: 'plotting',
    location: 'Pune',
    priceTotal: 1200000,
    unitSize: '1200 sqft',
    amenities: ['Gated layout', 'Road access', 'Clear title'],
    photos: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'],
    approvalStatus: 'published',
  },
  {
    title: 'Hillview Residency',
    category: 'residential',
    location: 'Mahabaleshwar',
    priceTotal: 8500000,
    unitSize: '1450 sqft',
    amenities: ['Mountain view', '24x7 security', 'Clubhouse'],
    photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'],
    approvalStatus: 'published',
  },
  {
    title: 'Amrut Business Hub',
    category: 'commercial',
    location: 'Mumbai',
    priceTotal: 25000000,
    unitSize: '2200 sqft',
    amenities: ['Prime footfall location', 'Parking', 'Elevator access'],
    photos: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80'],
    approvalStatus: 'published',
  },
  {
    title: 'Sangli Farm Estate',
    category: 'farm',
    location: 'Sangli',
    priceTotal: 3000000,
    unitSize: '3 acres',
    amenities: ['Water access', 'Fertile soil', 'Road-facing'],
    photos: ['https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80'],
    approvalStatus: 'draft',
  },
  {
    title: 'Kolhapur Heritage Plots',
    category: 'plotting',
    location: 'Kolhapur',
    priceTotal: 950000,
    unitSize: '1000 sqft',
    amenities: ['Approved layout', 'Near highway'],
    photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80'],
    approvalStatus: 'published',
  },
];

async function seed() {
  await connectDB();

  for (const p of PROPERTIES) {
    const existing = await Property.findOne({ title: p.title });
    if (existing) {
      console.log(`Skipping (already exists): ${p.title}`);
      continue;
    }
    await Property.create(p);
    console.log(`Created: ${p.title} [${p.approvalStatus}]`);
  }

  console.log('Done.');
  process.exit(0);
}

seed();
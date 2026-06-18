import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product';
import path from 'path';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function addCursor() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('MongoDB Connected');

  const cursorApp = {
    appId: 'cursor',
    appName: 'Cursor AI',
    category: 'AI Tools',
    plans: [
      {
        planName: 'Cursor Pro',
        description: 'Advanced AI coding assistant',
        features: ['Unlimited autocomplete', 'Pro features'],
        durations: [
          { months: 1, label: '1 Month', price: 0, discount: 0, saved: 0, tag: 'Standard' },
          { months: 3, label: '3 Months', price: 0, discount: 0, saved: 0, tag: 'Popular' },
          { months: 6, label: '6 Months', price: 0, discount: 0, saved: 0, tag: 'Value' },
          { months: 12, label: '12 Months', price: 0, discount: 0, saved: 0, tag: 'Best Deal' }
        ]
      },
      {
        planName: 'Cursor Pro Plus',
        description: 'Enhanced AI coding assistant',
        features: ['Priority support', 'More AI requests'],
        durations: [
          { months: 1, label: '1 Month', price: 0, discount: 0, saved: 0, tag: 'Standard' },
          { months: 3, label: '3 Months', price: 0, discount: 0, saved: 0, tag: 'Popular' },
          { months: 6, label: '6 Months', price: 0, discount: 0, saved: 0, tag: 'Value' },
          { months: 12, label: '12 Months', price: 0, discount: 0, saved: 0, tag: 'Best Deal' }
        ]
      },
      {
        planName: 'Cursor Ultra',
        description: 'Ultimate AI coding power',
        features: ['Unlimited fast requests', 'All features'],
        durations: [
          { months: 1, label: '1 Month', price: 0, discount: 0, saved: 0, tag: 'Standard' },
          { months: 3, label: '3 Months', price: 0, discount: 0, saved: 0, tag: 'Popular' },
          { months: 6, label: '6 Months', price: 0, discount: 0, saved: 0, tag: 'Value' },
          { months: 12, label: '12 Months', price: 0, discount: 0, saved: 0, tag: 'Best Deal' }
        ]
      }
    ]
  };

  await Product.updateOne({ appId: 'cursor' }, { $set: cursorApp }, { upsert: true });
  console.log('Cursor added');
  process.exit();
}

addCursor();

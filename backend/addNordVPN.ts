import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product';
import path from 'path';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function addNordVPN() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('MongoDB Connected');

  const nordApp = {
    appId: 'nordvpn',
    appName: 'NordVPN',
    category: 'VPN',
    plans: [
      {
        planName: 'Basic',
        description: 'Secure, high-speed VPN',
        features: [
          'High-speed VPN',
          'Malware protection'
        ],
        durations: [
          { months: 1, label: '1 Month', price: 0, discount: 0, saved: 0, tag: 'Standard' },
          { months: 3, label: '3 Months', price: 0, discount: 0, saved: 0, tag: 'Popular' },
          { months: 6, label: '6 Months', price: 0, discount: 0, saved: 0, tag: 'Value' },
          { months: 12, label: '12 Months', price: 0, discount: 0, saved: 0, tag: 'Best Deal' }
        ]
      },
      {
        planName: 'Plus',
        description: 'Advanced privacy and security',
        features: [
          'High-speed VPN',
          'Malware protection',
          'Tracker and ad blocker',
          'Cross-platform password manager'
        ],
        durations: [
          { months: 1, label: '1 Month', price: 0, discount: 0, saved: 0, tag: 'Standard' },
          { months: 3, label: '3 Months', price: 0, discount: 0, saved: 0, tag: 'Popular' },
          { months: 6, label: '6 Months', price: 0, discount: 0, saved: 0, tag: 'Value' },
          { months: 12, label: '12 Months', price: 0, discount: 0, saved: 0, tag: 'Best Deal' }
        ]
      },
      {
        planName: 'Complete Max',
        description: 'Ultimate security package',
        features: [
          'All Plus features',
          '1 TB cloud storage',
          'Next-generation file encryption',
          'Identity theft recovery'
        ],
        durations: [
          { months: 1, label: '1 Month', price: 0, discount: 0, saved: 0, tag: 'Standard' },
          { months: 3, label: '3 Months', price: 0, discount: 0, saved: 0, tag: 'Popular' },
          { months: 6, label: '6 Months', price: 0, discount: 0, saved: 0, tag: 'Value' },
          { months: 12, label: '12 Months', price: 0, discount: 0, saved: 0, tag: 'Best Deal' }
        ]
      }
    ]
  };

  await Product.updateOne({ appId: 'nordvpn' }, { $set: nordApp }, { upsert: true });
  console.log('NordVPN added');
  process.exit();
}

addNordVPN();

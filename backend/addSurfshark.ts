import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product';
import path from 'path';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function addSurfshark() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('MongoDB Connected');

  const surfsharkApp = {
    appId: 'surfshark',
    appName: 'Surfshark VPN',
    category: 'VPN',
    plans: [
      {
        planName: 'Surfshark Starter',
        description: 'Essential VPN security for your devices',
        features: [
          'Secure VPN',
          'Ad blocker',
          'Cookie pop-up blocker'
        ],
        durations: [
          { months: 1, label: '1 Month', price: 0, discount: 0, saved: 0, tag: 'Standard' },
          { months: 3, label: '3 Months', price: 0, discount: 0, saved: 0, tag: 'Popular' },
          { months: 6, label: '6 Months', price: 0, discount: 0, saved: 0, tag: 'Value' },
          { months: 12, label: '12 Months', price: 0, discount: 0, saved: 0, tag: 'Best Deal' }
        ]
      },
      {
        planName: 'Surfshark One',
        description: 'Comprehensive privacy and security suite',
        features: [
          'All Starter features',
          'Antivirus protection',
          'Real-time breach alerts',
          'Private search engine'
        ],
        durations: [
          { months: 1, label: '1 Month', price: 0, discount: 0, saved: 0, tag: 'Standard' },
          { months: 3, label: '3 Months', price: 0, discount: 0, saved: 0, tag: 'Popular' },
          { months: 6, label: '6 Months', price: 0, discount: 0, saved: 0, tag: 'Value' },
          { months: 12, label: '12 Months', price: 0, discount: 0, saved: 0, tag: 'Best Deal' }
        ]
      },
      {
        planName: 'Surfshark One+',
        description: 'Ultimate privacy with data removal',
        features: [
          'All One features',
          'Data removal from company databases',
          'Data removal from people search sites'
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

  await Product.updateOne({ appId: 'surfshark' }, { $set: surfsharkApp }, { upsert: true });
  console.log('Surfshark added');
  process.exit();
}

addSurfshark();

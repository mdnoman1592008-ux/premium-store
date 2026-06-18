import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product';
import path from 'path';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function addExpressVPN() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('MongoDB Connected');

  const expressApp = {
    appId: 'expressvpn',
    appName: 'ExpressVPN',
    category: 'VPN',
    plans: [
      {
        planName: 'Basic',
        description: 'High-speed, secure VPN for everyday use',
        features: [
          'High-speed VPN servers in 105 countries',
          'Aircove OS secure router access',
          '24/7 customer support'
        ],
        durations: [
          { months: 1, label: '1 Month', price: 0, discount: 0, saved: 0, tag: 'Standard' },
          { months: 3, label: '3 Months', price: 0, discount: 0, saved: 0, tag: 'Popular' },
          { months: 6, label: '6 Months', price: 0, discount: 0, saved: 0, tag: 'Value' },
          { months: 12, label: '12 Months', price: 0, discount: 0, saved: 0, tag: 'Best Deal' }
        ]
      },
      {
        planName: 'Advanced',
        description: 'Advanced protection with ad blocking',
        features: [
          'All Basic features',
          'Advanced Threat Protection',
          'Ad blocker and tracker blocker',
          'ExpressVPN Keys password manager'
        ],
        durations: [
          { months: 1, label: '1 Month', price: 0, discount: 0, saved: 0, tag: 'Standard' },
          { months: 3, label: '3 Months', price: 0, discount: 0, saved: 0, tag: 'Popular' },
          { months: 6, label: '6 Months', price: 0, discount: 0, saved: 0, tag: 'Value' },
          { months: 12, label: '12 Months', price: 0, discount: 0, saved: 0, tag: 'Best Deal' }
        ]
      },
      {
        planName: 'Express Pro',
        description: 'Ultimate privacy and identity protection',
        features: [
          'All Advanced features',
          'Dedicated IP address',
          'Identity Defender (US only)',
          'Data Removal services'
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

  await Product.updateOne({ appId: 'expressvpn' }, { $set: expressApp }, { upsert: true });
  console.log('ExpressVPN added');
  process.exit();
}

addExpressVPN();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product';
import path from 'path';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function addFigma() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('MongoDB Connected');

  const figmaApp = {
    appId: 'figma',
    appName: 'Figma',
    category: 'Design',
    plans: [
      {
        planName: 'Enterprise',
        description: 'Advanced features and security for scaling organizations.',
        features: [
          'Choose Enterprise if you:',
          'Are a business designing for multiple products or brands',
          'Need enterprise-level security',
          'Want scalable design systems and simpler admin management',
          'Key features:',
          'Custom team workspaces',
          'Design system theming and APIs',
          'SCIM seat management'
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

  await Product.updateOne({ appId: 'figma' }, { $set: figmaApp }, { upsert: true });
  console.log('Figma added');
  process.exit();
}

addFigma();

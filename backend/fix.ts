import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product';
import path from 'path';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('MongoDB Connected');

  const product = await Product.findOne({ appId: 'chatgpt' });
  if (product) {
    for (let plan of product.plans) {
      if (plan.planName === 'ChatGPT Pro') {
        const correctDurations = [
          { months: 1, label: '1 Month', price: 0, discount: 0, saved: 0, tag: 'Standard' },
          { months: 3, label: '3 Months', price: 0, discount: 0, saved: 0, tag: 'Popular' },
          { months: 6, label: '6 Months', price: 0, discount: 0, saved: 0, tag: 'Value' },
          { months: 12, label: '12 Months', price: 0, discount: 0, saved: 0, tag: 'Best Deal' }
        ];
        
        // Remove the existing broken array and set the correct one
        plan.durations.splice(0, plan.durations.length);
        plan.durations.push(...correctDurations);
      }
    }
    await product.save();
    console.log('Fixed chatgpt');
  }
  process.exit();
}

fix();

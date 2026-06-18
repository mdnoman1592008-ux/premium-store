import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product';
import path from 'path';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function updateCursorUltra() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('MongoDB Connected');

  const product = await Product.findOne({ appId: 'cursor' });
  if (product) {
    for (let plan of product.plans) {
      if (plan.planName === 'Cursor Ultra') {
        plan.features = [
          'Everything in Pro, plus:',
          '20x Pro limits on Agent',
          'Access to frontier models',
          'MCPs, skills, and hooks',
          'Cloud agents',
          'Bugbot on usage-based billing',
          'Priority access to new features'
        ];
        plan.markModified('features');
      }
    }
    await product.save();
    console.log('Updated Cursor Ultra features');
  }
  process.exit();
}

updateCursorUltra();

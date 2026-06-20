import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';

dotenv.config();

const URI = 'mongodb://jjdxjdnxhsmhxnsdje_db_user:gYMMazWDrZ5MF4Tw@ac-6gzwckk-shard-00-00.6hf23vb.mongodb.net:27017,ac-6gzwckk-shard-00-01.6hf23vb.mongodb.net:27017,ac-6gzwckk-shard-00-02.6hf23vb.mongodb.net:27017/premium-account-store?ssl=true&replicaSet=atlas-p4g6u4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

const add18MonthsGemini = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Connected to MongoDB.');

    const product = await Product.findOne({ appId: 'gemini' });
    if (!product) {
      console.log('Gemini product not found.');
      process.exit(0);
    }

    let updated = false;

    for (const plan of product.plans) {
      const has18Months = plan.durations.some(d => d.months === 18 || d.label === '18 Months');
      if (!has18Months) {
        plan.durations.push({
          months: 18,
          label: '18 Months',
          price: 0,
          discount: 0
        });
        updated = true;
      }
    }

    if (updated) {
      await product.save();
      console.log('18 Months duration added to all Gemini plans successfully!');
    } else {
      console.log('18 Months already exists in Gemini plans.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

add18MonthsGemini();

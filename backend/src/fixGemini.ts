import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/premiumstore');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const fixGemini = async () => {
  try {
    await connectDB();
    const product = await Product.findOne({ appId: 'gemini' });
    if (product) {
      const defaultDurations = [
        { months: 1, label: '1 Month', price: 0, discount: 0, saved: 0, tag: 'Standard' },
        { months: 3, label: '3 Months', price: 0, discount: 0, saved: 0, tag: 'Popular' },
        { months: 6, label: '6 Months', price: 0, discount: 0, saved: 0, tag: 'Value' },
        { months: 12, label: '12 Months', price: 0, discount: 0, saved: 0, tag: 'Best Deal' }
      ];

      let updated = false;
      product.plans.forEach((plan: any) => {
        if (!plan.durations || plan.durations.length === 0 || !plan.durations[0].label) {
          plan.durations = defaultDurations;
          updated = true;
        }
      });

      if (updated) {
        await product.save();
        console.log('Gemini Ultra / Pro durations fixed successfully!');
      } else {
        console.log('No fix needed. Durations are already populated.');
      }
    } else {
      console.log('Gemini product not found.');
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixGemini();

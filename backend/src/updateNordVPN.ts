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

const updateLogo = async () => {
  try {
    await connectDB();
    const product = await Product.findOne({ $or: [{ appId: /nordvpn/i }, { name: /nord/i }] });
    if (product) {
      product.logo = '/nordvpn_icon.png';
      await product.save();
      console.log(`Updated logo for product: ${product.name}`);
    } else {
      console.log('NordVPN product not found in database.');
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

updateLogo();

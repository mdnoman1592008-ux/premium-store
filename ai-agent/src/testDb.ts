import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Product from './models/Product';

mongoose.connect(process.env.MONGODB_URI as string).then(async () => {
  const p = await Product.findOne({appId: 'gemini'});
  console.log(JSON.stringify(p?.plans, null, 2));
  process.exit(0);
}).catch(console.error);

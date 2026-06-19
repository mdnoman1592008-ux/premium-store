import mongoose from 'mongoose';

const durationSchema = new mongoose.Schema({
  months: { type: Number, required: true },
  label: { type: String, required: true },
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  saved: { type: Number, default: 0 },
  tag: { type: String, default: '' },
});

const planSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  durations: { type: [durationSchema], default: [] }
});

const productSchema = new mongoose.Schema({
  appId: { type: String, required: true, unique: true },
  appName: { type: String, required: true },
  category: { type: String, required: true },
  plans: [planSchema]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;

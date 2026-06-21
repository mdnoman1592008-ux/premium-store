const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://jjdxjdnxhsmhxnsdje_db_user:gYMMazWDrZ5MF4Tw@ac-6gzwckk-shard-00-00.6hf23vb.mongodb.net:27017,ac-6gzwckk-shard-00-01.6hf23vb.mongodb.net:27017,ac-6gzwckk-shard-00-02.6hf23vb.mongodb.net:27017/premium-account-store?ssl=true&replicaSet=atlas-p4g6u4-shard-0&authSource=admin&retryWrites=true&w=majority";

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
  durations: [durationSchema]
});

const productSchema = new mongoose.Schema({
  appId: { type: String, required: true },
  appName: { type: String, required: true },
  category: { type: String, required: true },
  plans: [planSchema]
}, { collection: 'products' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');
    
    const products = await Product.find({});
    for (const product of products) {
      if (product.appId.toLowerCase() === 'gemini') continue; // keep 18 months for Gemini
      let updated = false;
      product.plans.forEach((plan) => {
        const initialLength = plan.durations.length;
        plan.durations = plan.durations.filter(d => d.months !== 18 && !d.label.includes('18 Month'));
        if (plan.durations.length !== initialLength) {
          updated = true;
          console.log(`Removed 18 months from ${product.appName} - ${plan.planName}`);
        }
      });
      if (updated) {
        await product.save();
      }
    }
    
    console.log('Finished removing 18 months from non-Gemini apps.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();

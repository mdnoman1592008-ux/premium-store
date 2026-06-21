import mongoose from 'mongoose';

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
    
    const gemini = await Product.findOne({ appId: 'gemini' });
    if (!gemini) {
      console.log('Gemini not found');
      process.exit(1);
    }
    
    console.log('Found Gemini product.');
    let updated = false;

    gemini.plans.forEach((plan: any) => {
      console.log(`Checking plan: ${plan.planName}`);
      const has18 = plan.durations.some((d: any) => d.months === 18 || d.label === '18 Months');
      if (!has18) {
        console.log(`Adding 18 Months to ${plan.planName}`);
        plan.durations.push({
          months: 18,
          label: '18 Months',
          price: 0,
          discount: 0,
          saved: 0,
          tag: 'Value'
        });
        updated = true;
      } else {
        console.log(`18 Months already exists in ${plan.planName}`);
      }
    });

    if (updated) {
      await gemini.save();
      console.log('Successfully saved Gemini with 18 months duration.');
    } else {
      console.log('No updates needed.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();

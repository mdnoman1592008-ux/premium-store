import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  appName: { type: String, required: true },
  planName: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
  senderNumber: { type: String, required: true },
  screenshotUrl: { type: String },
  status: { type: String, enum: ['Pending', 'Verified', 'Delivered', 'Cancelled'], default: 'Pending' },
  credentialsEmail: { type: String },
  credentialsPassword: { type: String },
  credentialsPin: { type: String },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;

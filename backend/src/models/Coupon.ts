import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountPercentage: { type: Number, required: true }, // e.g., 10 for 10%
  validUntil: { type: Date, required: true },
  applicableApp: { type: String, default: 'All' },
  maxUses: { type: Number, default: 0 },
  usesCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;

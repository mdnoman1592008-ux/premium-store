import mongoose from 'mongoose';

const paymentSettingSchema = new mongoose.Schema({
  method: { type: String, required: true, unique: true }, // 'bkash', 'nagad', 'rocket', 'upay', 'cellfin'
  number: { type: String, required: true },
  qrCodeUrl: { type: String, default: '' },
}, { timestamps: true });

const PaymentSetting = mongoose.model('PaymentSetting', paymentSettingSchema);
export default PaymentSetting;

import mongoose from 'mongoose';

const baileysAuthSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true }
}, { timestamps: true });

const BaileysAuth = mongoose.model('BaileysAuth', baileysAuthSchema);
export default BaileysAuth;

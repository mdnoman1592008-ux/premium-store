import mongoose from 'mongoose';

const agentSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const AgentSetting = mongoose.model('AgentSetting', agentSettingSchema);
export default AgentSetting;

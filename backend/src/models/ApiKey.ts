import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
  provider: { 
    type: String, 
    required: true,
    enum: ['openrouter', 'deepseek', 'groq', 'gemini'] 
  },
  key: { 
    type: String, 
    required: true,
    unique: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastError: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Check if model already exists to avoid OverwriteModelError in Next.js/HMR environments
const ApiKey = mongoose.models.ApiKey || mongoose.model('ApiKey', apiKeySchema);
export default ApiKey;

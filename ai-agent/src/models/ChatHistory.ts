import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  messages: [{
    role: { type: String, enum: ['user', 'model'], required: true },
    parts: [{
      text: { type: String, required: true }
    }]
  }]
}, { timestamps: true });

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
export default ChatHistory;

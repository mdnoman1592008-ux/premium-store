import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`AI Agent connected to MongoDB: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`AI Agent Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

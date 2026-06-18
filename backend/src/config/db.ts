import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Disable command buffering so that DB errors fail fast instead of hanging requests
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Database Connection Warning: ${error.message}`);
    console.warn('Running backend in offline/disconnected mode. Database operations will return errors immediately instead of hanging.');
  }
};

export default connectDB;

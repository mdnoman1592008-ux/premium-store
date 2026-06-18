import mongoose from 'mongoose';
import dns from 'dns';

// Force public DNS resolution to prevent local SRV query failures (querySrv ECONNREFUSED) in Node.js
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (error) {
  console.warn('Failed to set custom DNS servers:', error);
}
// Removed custom DNS to allow default system resolution

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

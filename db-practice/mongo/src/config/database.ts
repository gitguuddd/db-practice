import mongoose from 'mongoose';

export async function connectDatabase() {
  await mongoose.connect('mongodb://admin:password@localhost:27017/mongo-practice?authSource=admin');
  console.log('Connected to MongoDB');
}
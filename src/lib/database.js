import connectDB from './mongodb';
import Student from '@/models/Student'; // Adjust based on your model path

export async function getUserFromDB(userId) {
  await connectDB(); // Ensure DB is connected

  // Find user by the decoded user ID
  const user = await Student.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

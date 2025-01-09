import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import mongoose from 'mongoose';

export async function POST(req) {
  const { email, profilePicture } = await req.json();  // Ensure you're parsing the request body as JSON

  // Validate email
  if (!email || typeof email !== 'string') {
    console.error('Invalid email:', email);
    return new Response(JSON.stringify({ message: 'Invalid email' }), { status: 400 });
  }

  try {
    // Connect to the database
    await connectDB();

    // Find the student by email and update the profile picture
    const updatedStudent = await Student.findOneAndUpdate(
      { email: email },
      { profilePicture: profilePicture },
      { new: true }
    );

    if (!updatedStudent) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Profile updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return new Response(JSON.stringify({ message: 'Failed to update profile', error: error.message }), { status: 500 });
  }
}

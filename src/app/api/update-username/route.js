import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request) {
  try {
    // Step 1: Parse the incoming request
    const { email, username } = await request.json();

    // Step 2: Validate input fields
    if (!email || !username) {
      return NextResponse.json({ error: 'Email and username are required' }, { status: 400 });
    }

    // Step 3: Connect to the database
    await connectDB();

    // Step 4: Check if the username already exists
    const existingUser = await Student.findOne({ name: username });

    // Step 5: Ensure the username is not already taken by another user
    if (existingUser && existingUser._id.toString() !== email) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
    }

    // Step 6: Update the user's username by email
    const updatedUser = await Student.findOneAndUpdate(
      { email: email },  // Find the user by email
      { name: username }, // Update the name
      { new: true }       // Return the updated document
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    // Step 7: Return the updated user data (excluding password)
    return NextResponse.json(
      { message: 'Username updated successfully', user: { id: updatedUser._id, name: updatedUser.name } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating username:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

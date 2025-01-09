import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request) {
  try {
    // Step 1: Parse the incoming request
    const { username } = await request.json();

    // Step 2: Validate input field
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Step 3: Connect to the database
    await connectDB();

    // Step 4: Check if the username exists
    const existingUser = await Student.findOne({ name: username });

    // Step 5: Respond based on the existence of the username
    if (existingUser) {
      return NextResponse.json({ isAvailable: false }, { status: 200 });
    }

    return NextResponse.json({ isAvailable: true }, { status: 200 });
  } catch (error) {
    console.error('Error checking username availability:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

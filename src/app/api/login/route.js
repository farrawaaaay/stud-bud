import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request) {
  try {
    // Step 1: Parse the incoming request
    const { name, password } = await request.json();

    // Step 2: Log the received name and password (avoid in production)
    console.log('Received name:', name);

    // Step 3: Validate input fields
    if (!name || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Step 4: Connect to the database
    await connectDB();

    // Step 5: Find user by name
    const student = await Student.findOne({ name });

    // Step 6: Ensure student exists
    if (!student) {
      console.log(`No student found with name: ${name}`);
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    // Step 7: Log the student object (ensure sensitive data like password is not logged)
    console.log('Student found:', { id: student._id, name: student.name, email: student.email, profilePicture: student.profilePicture });

    // Step 8: Check if the password matches
    const isMatch = await bcrypt.compare(password, student.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 400 });
    }

    // Step 9: Return student data without the password
    return NextResponse.json(
      { 
        message: 'Login successful',
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          profilePicture: student.profilePicture,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

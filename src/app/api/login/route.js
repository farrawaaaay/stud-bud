import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Connect to database
    await connectDB();

    // Find user by email
    const student = await Student.findOne({ email });
    if (!student) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    // Compare the password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    // Return a response with the student data (without the password)
    return NextResponse.json(
      { 
        message: 'Login successful',
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

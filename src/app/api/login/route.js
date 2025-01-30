import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';  // Import JWT
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request) {
  try {
    // Step 1: Parse the incoming request
    const { name, password } = await request.json();

    // Step 2: Validate input fields
    if (!name || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Step 3: Connect to the database
    await connectDB();

    // Step 4: Find user by name
    const student = await Student.findOne({ name });

    // Step 5: Ensure student exists
    if (!student) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 400 });
    }

    // Step 6: Check if the password matches
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 400 });
    }

    // Step 7: Generate JWT Token
    const token = jwt.sign(
      { id: student._id, name: student.name },  // Payload
      process.env.JWT_SECRET,                   // Secret key (should be stored in env variables)
      { expiresIn: '1h' }                      // Expiration time
    );

    // Step 8: Return student data and token
    return NextResponse.json(
      { 
        message: 'Login successful',
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          profilePicture: student.profilePicture,
        },
        token, // Send token in the response
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

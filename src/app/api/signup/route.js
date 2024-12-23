import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    
    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student
    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { 
        message: 'Student registered successfully',
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Error creating student' },
      { status: 500 }
    );
  }
}

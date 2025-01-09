import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request) {
  try {
    // Parse request body
    const { email, newEmail } = await request.json();

    

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return NextResponse.json(
        { error: 'New email is not valid.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the user by email
    const student = await Student.findOne({ email });
    if (!student) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    // Check if the new email is already in use
    const existingEmail = await Student.findOne({ email: newEmail });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'The new email is already in use.' },
        { status: 400 }
      );
    }

    // Update the email in the database
    student.email = newEmail;
    await student.save();

    return NextResponse.json(
      { message: 'Email changed successfully.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Change email error:', error);
    return NextResponse.json(
      { error: 'Error changing email.' },
      { status: 500 }
    );
  }
}

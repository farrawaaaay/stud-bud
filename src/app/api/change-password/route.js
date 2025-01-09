import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import bcrypt from 'bcryptjs'; // Used only for reading hashed current password

export async function POST(request) {
  try {
    // Parse request body
    const { email, currentPassword, newPassword, confirmPassword } = await request.json();

    // Validate input
    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirm password do not match.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
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

    // Verify the hashed current password
    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    // Update the password in the database without hashing
    student.password = newPassword;
    await student.save();

    return NextResponse.json(
      { message: 'Password changed successfully.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Error changing password.' },
      { status: 500 }
    );
  }
}

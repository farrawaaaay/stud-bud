import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';

export async function GET(request) {
  try {
    // Step 1: Get the JWT token from the Authorization header
    const token = request.headers.get('Authorization')?.split(' ')[1]; // Extract token from header

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Step 2: Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Step 3: Fetch user details from the database
    const student = await Student.findById(decoded.id).select('name email profilePicture'); // Fetch only necessary fields

    if (!student) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Step 4: Return user data
    return NextResponse.json(
      { 
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          profilePicture: student.profilePicture,
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

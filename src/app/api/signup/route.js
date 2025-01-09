import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';


export async function POST(request) {
  try {
    const { name, email, password, profilePic } = await request.json();

    // Connect to database
    await connectDB();

    // Check if email or username already exists
    const existingStudent = await Student.findOne({ $or: [{ email }, { name }] });

    if (existingStudent) {
      const errorMessage = existingStudent.email === email
        ? 'Email already registered'
        : 'Username already taken';
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }


    // Default profile picture (if none provided)
    const defaultProfilePic = 'https://res.cloudinary.com/dvorbtw7b/image/upload/v1735892282/StudBud/default_profile.svg';
    const profilePicture = profilePic || defaultProfilePic;

    // Create new student
    const student = await Student.create({
      name,
      email,
      password,
      profilePicture,
    });

    return NextResponse.json(
      {
        message: 'Student registered successfully',
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          profilePicture: student.profilePicture, // Include the profile picture in the response
        },
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

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import Workspace from '@/models/Workspace';


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

     // Create a default workspace for the new student
     const defaultWorkspace = await Workspace.create({
      title: `${name}'s Workspace`,
      owner: student._id, // Associate the workspace with the student
      members: [student._id], // Add the student as the only initial member
      isDefault: true,
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
        workspace: {
          id: defaultWorkspace._id,
          title: defaultWorkspace.title,
          owner: defaultWorkspace.owner,
          members: defaultWorkspace.members,
          isDefault: defaultWorkspace.isDefault,
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

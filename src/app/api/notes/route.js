import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Note from "@/models/Note";

export async function POST(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: studentId } = decoded;

    if (!studentId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Parse the request body
    const { title, content, category } = await request.json();

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Create a new note
    const note = new Note({
      title,
      content,
      category,
      studentId, // Add the studentId from the token
    });

    // Save the note to the database
    const savedNote = await note.save();

    return NextResponse.json(savedNote, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// Fetch all notes for a student
// Fetch all notes for a student
export async function GET(request) {
    try {
      // Step 1: Validate token
      const token = request.headers.get('Authorization')?.split(' ')[1];
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const studentId = decoded.id;
  
      // Step 2: Connect to the database
      await connectDB();
  
      // Step 3: Retrieve all notes belonging to the authenticated student
      const notes = await Note.find({ studentId }); // Match the field name to `studentId`
  
      // Step 4: Return the notes
      return NextResponse.json(notes, { status: 200 });
  
    } catch (error) {
      console.error('Error fetching notes:', error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }
  

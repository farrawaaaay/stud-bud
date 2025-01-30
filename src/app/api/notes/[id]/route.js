import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Note from "@/models/Note";

// Named export for the PUT method
export async function PUT(request, { params }) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]; // Extract token
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
    

    // Connect to the database
    await connectDB();

    // Find the note by ID and studentId to ensure the student owns the note
    const note = await Note.findOne({ _id: params.id, studentId });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Update the note
    note.title = title;
    note.content = content;
    note.category = category;
    note.updatedAt = new Date();

    const updatedNote = await note.save();

    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Named export for the DELETE method
export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]; // Extract token
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: studentId } = decoded;

    if (!studentId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Connect to the database
    await connectDB();

    // Find the note by ID and studentId to ensure the student owns the note
    const note = await Note.findOneAndDelete({ _id: params.id, studentId });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

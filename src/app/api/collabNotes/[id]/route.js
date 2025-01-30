import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import CollabNote from "@/models/CollabNotes";
import Workspace from "@/models/Workspace";
import Student from "@/models/Student";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
      const { id: noteId } = params;
      const { newTitle, newContent } = await request.json();
  
      const token = request.headers.get("Authorization")?.split(" ")[1];
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { id: studentId } = decoded;
  
      if (!studentId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      await connectDB();
  
      const collabNote = await CollabNote.findById(noteId);
  
      if (!collabNote) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
  
      if (collabNote.owner.toString() !== studentId) {
        return NextResponse.json({ error: "You do not own this note" }, { status: 403 });
      }
  
      // Update the note
      collabNote.title = newTitle || collabNote.title;
      collabNote.content = newContent || collabNote.content;
      await collabNote.save();
  
      // Return updated note with owner
      const updatedNote = await CollabNote.findById(noteId).populate("owner", "name _id");
  
      return NextResponse.json(updatedNote, { status: 200 });
    } catch (error) {
      console.error("Error updating note:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
  

  export async function DELETE(request, { params }) {
    try {
      // Await params to get the note ID
      const { id: noteId } = await params;
  
      // Extract the token from the Authorization header
      const token = request.headers.get("Authorization")?.split(" ")[1];
  
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { id: studentId } = decoded;
  
      if (!studentId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      // Connect to the database
      await connectDB();
  
      // Find the note
      const collabNote = await CollabNote.findById(noteId);
  
      if (!collabNote) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
  
      // Ensure the current user owns the note
      if (collabNote.owner.toString() !== studentId) {
        return NextResponse.json({ error: "You do not own this note" }, { status: 403 });
      }
  
      // Use findByIdAndDelete instead of .remove()
      await CollabNote.findByIdAndDelete(noteId);
  
      return NextResponse.json({ message: "Note deleted" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting note:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
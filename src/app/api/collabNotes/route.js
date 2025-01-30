import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import CollabNote from "@/models/CollabNotes";
import Workspace from "@/models/Workspace";
import Student from "@/models/Student";

export async function POST(request) {
    try {
      const token = request.headers.get("Authorization")?.split(" ")[1];
  
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { id: studentId } = decoded;
  
      if (!studentId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
  
      // Parse request body
      const { collabNoteContent, workspaceId, collabNoteTitle } = await request.json();
  
      if (!collabNoteContent || !workspaceId || !collabNoteTitle) {
        return NextResponse.json({ error: "Note content, title, and workspace ID are required" }, { status: 400 });
      }
  
      // Connect to the database
      await connectDB();
  
      // Check if the workspace exists and if the user is part of it
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
      }
  
      if (!workspace.members.includes(studentId)) {
        return NextResponse.json({ error: "You are not a member of this workspace" }, { status: 403 });
      }
  
      // Fetch the owner's name
      const owner = await Student.findById(studentId).select("name");
      if (!owner) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      // Create the new note with title
      const newCollabNote = new CollabNote({
        title: collabNoteTitle, // Save title
        content: collabNoteContent,
        workspace: workspaceId,
        owner: studentId, // Save only the ID
      });
  
      const savedCollabNote = await newCollabNote.save();
  
      // Attach the owner's name before sending the response
      const responseNote = {
        _id: savedCollabNote._id,
        title: savedCollabNote.title, // Include title
        content: savedCollabNote.content,
        workspace: savedCollabNote.workspace,
        owner: {
          _id: savedCollabNote.owner,
          name: owner.name, // Include owner's name
        },
        createdAt: savedCollabNote.createdAt,
      };
  
      return NextResponse.json(responseNote, { status: 201 });
    } catch (error) {
      console.error("Error creating note:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

  

export async function GET(request) {
    try {
      const token = request.headers.get("Authorization")?.split(" ")[1];
  
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { id: studentId } = decoded;
  
      if (!studentId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
  
      // Parse query params (e.g., workspaceId)
      const url = new URL(request.url);
      const workspaceId = url.searchParams.get("workspaceId");
  
      if (!workspaceId) {
        return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
      }
  
      // Connect to the database
      await connectDB();
  
      // Check if the workspace exists and if the user is part of it
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
      }
  
      if (!workspace.members.includes(studentId)) {
        return NextResponse.json({ error: "You are not a member of this workspace" }, { status: 403 });
      }
  
      // Fetch notes and populate the owner's name
      const collabNotes = await CollabNote.find({ workspace: workspaceId }).populate("owner", "name");
  
      return NextResponse.json(collabNotes, { status: 200 });
    } catch (error) {
      console.error("Error fetching notes:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
  

export async function GET_COLLABNOTE(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: studentId } = decoded;

    if (!studentId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Parse query params (e.g., noteId)
    const url = new URL(request.url);
    const collabNoteId = url.searchParams.get("collabNoteId");

    if (!collabNoteId) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
    }

    // Connect to the database
    await connectDB();

    // Fetch the specific note
    const collabNote = await CollabNote.findById(collabNoteId);

    if (!collabNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(collabNote, { status: 200 });
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: studentId } = decoded;

    if (!studentId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Parse request body
    const { collabNoteId, newContent } = await request.json();

    if (!collabNoteId || !newContent) {
      return NextResponse.json({ error: "Note ID and new content are required" }, { status: 400 });
    }

    // Connect to the database
    await connectDB();

    // Find and update the note
    const collabNote = await CollabNote.findById(collabNoteId);

    if (!collabNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (collabNote.owner.toString() !== studentId) {
      return NextResponse.json({ error: "You do not own this note" }, { status: 403 });
    }

    collabNote.content = newContent;
    const updatedNote = await collabNote.save();

    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: studentId } = decoded;

    if (!studentId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Parse request body
    const { collabNoteId } = await request.json();

    if (!collabNoteId) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
    }

    // Connect to the database
    await connectDB();

    // Find and delete the note
    const collabNote = await CollabNote.findById(collabNoteId);

    if (!collabNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (collabNote.owner.toString() !== studentId) {
      return NextResponse.json({ error: "You do not own this note" }, { status: 403 });
    }

    await collabNote.remove();

    return NextResponse.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

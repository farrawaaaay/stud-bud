// /app/api/workspaces/create/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Workspace from "@/models/Workspace";

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
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    // Connect to the database
    await connectDB();

    // Create the new workspace
    const newWorkspace = new Workspace({
      title,
      description,
      owner: studentId,
      members: [studentId],  // The user who created the workspace is the first member
    });

    const savedWorkspace = await newWorkspace.save();

    return NextResponse.json(savedWorkspace, { status: 201 });
  } catch (error) {
    console.error("Error creating workspace:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

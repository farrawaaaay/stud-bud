// /app/api/workspaces/update-title/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Workspace from "@/models/Workspace";

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
    const { workspaceId, title } = await request.json();

    if (!workspaceId || !title) {
      return NextResponse.json({ error: "Workspace ID and new title are required" }, { status: 400 });
    }

    // Connect to the database
    await connectDB();

    // Find the workspace by ID
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Check if the current user is the owner of the workspace
    if (workspace.owner.toString() !== studentId) {
      return NextResponse.json({ error: "You are not authorized to update this workspace" }, { status: 403 });
    }

    // Update the workspace title
    workspace.title = title;

    // Save the updated workspace
    const updatedWorkspace = await workspace.save();

    return NextResponse.json(updatedWorkspace, { status: 200 });
  } catch (error) {
    console.error("Error updating workspace title:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

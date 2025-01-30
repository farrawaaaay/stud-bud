// /app/api/workspaces/join/route.js
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
    const { workspaceId } = await request.json();

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    // Connect to the database
    await connectDB();

    // Find workspace by ID
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Check if the user is already a member
    if (workspace.members.includes(studentId)) {
      return NextResponse.json({ error: "You are already a member of this workspace" }, { status: 400 });
    }

    // Add user to the workspace
    workspace.members.push(studentId);
    const updatedWorkspace = await workspace.save();

    return NextResponse.json(updatedWorkspace, { status: 200 });
  } catch (error) {
    console.error("Error joining workspace:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

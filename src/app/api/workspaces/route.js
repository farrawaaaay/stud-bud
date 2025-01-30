// /app/api/workspaces/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // Your MongoDB connection
import Workspace from "@/models/Workspace"; // Your Workspace model
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    // Step 1: Extract token from the request
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: studentId } = decoded;

    // Step 3: Connect to the database
    await connectDB();

    // Step 4: Find all workspaces where the studentId is a member
    const workspaces = await Workspace.find({ members: studentId }).populate('members', 'name profilePic');

    // Step 5: Return the workspaces
    return NextResponse.json(workspaces, { status: 200 });
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    // Step 1: Extract token from the request
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: studentId } = decoded;

    // Step 3: Get the workspaceId from the request body
    const { workspaceId } = await request.json();
    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    // Step 4: Connect to the database
    await connectDB();

    // Step 5: Find the workspace and check if the user is the owner
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    if (workspace.owner.toString() !== studentId) {
      return NextResponse.json({ error: "You are not the owner of this workspace" }, { status: 403 });
    }

    // Step 6: Delete the workspace
    await Workspace.findByIdAndDelete(workspaceId);

    // Step 7: Return success response
    return NextResponse.json({ message: "Workspace deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
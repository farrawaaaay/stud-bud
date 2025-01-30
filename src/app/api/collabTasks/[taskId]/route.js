import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import CollabTask from "@/models/CollabTasks";
import Student from "@/models/Student";


export async function PUT(request, { params }) {
  try {
    const { taskId } = await params;
    const token = request.headers.get("Authorization")?.split(" ")[1]; // Extract token

    if (!token) {
      console.error("No token provided");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("Token verification failed:", err);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();

    // Check if newStatus is provided and valid
    if (!status) {
      console.error("New status is missing");
      return NextResponse.json({ error: "New status is required" }, { status: 400 });
    }

    if (!["TODO", "IN_PROGRESS", "COMPLETED"].includes(status)) {
      console.error(`Invalid status received: ${status}`);
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Find the task
    const task = await CollabTask.findById(taskId);
    if (!task) {
      console.error(`CollabTask not found for ID: ${taskId}`);
      return NextResponse.json({ error: "CollabTask not found" }, { status: 404 });
    }

    // Check if the logged-in user is the assignee
    if (task.assignee && task.assignee.toString() !== decoded.id) {
      console.error("User is not the assignee, cannot update task status");
      return NextResponse.json({ error: "You are not the assignee of this task" }, { status: 403 });
    }

    // Update task status
    task.status = status;
    const updatedTask = await task.save();

    return NextResponse.json({ message: "CollabTask status updated successfully", task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Error updating CollabTask:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { taskId } = await params;
    const token = request.headers.get("Authorization")?.split(" ")[1]; // Extract token

    if (!token) {
      console.error("No token provided");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("Token verification failed:", err);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the task
    const task = await CollabTask.findById(taskId);
    if (!task) {
      console.error(`CollabTask not found for ID: ${taskId}`);
      return NextResponse.json({ error: "CollabTask not found" }, { status: 404 });
    }

    // Check if the logged-in user is the assignor (creator) or assignee
    if (task.assignor.toString() !== decoded.id && task.assignee.toString() !== decoded.id) {
      console.error("User is not the assignor or assignee, cannot delete task");
      return NextResponse.json({ error: "You are not authorized to delete this task" }, { status: 403 });
    }

    // Delete the task
    await CollabTask.deleteOne({ _id: taskId });

    return NextResponse.json({ message: "CollabTask deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting CollabTask:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


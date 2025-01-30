import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task"; // Your Task Mongoose model

export async function PATCH(request, { params }) {
  const taskId = params.id;

  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.id;

    // Extract the fields from the request body
    const { status, title, content, category, deadline } = await request.json();

    console.log("Request to update task:", taskId); // Debug log
    console.log("Received Data:", { status, title, content, category, deadline }); // Debug log

    await connectDB();

    // Find the task by taskId and studentId
    const task = await Task.findOne({ _id: taskId, studentId });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update only the fields that are present in the request body
    if (status !== undefined) task.status = status;  // Only update status if it's provided
    if (title !== undefined) task.title = title;    // Only update title if it's provided
    if (content !== undefined) task.content = content;  // Only update content if it's provided
    if (category !== undefined) task.category = category;  // Only update category if it's provided
    if (deadline !== undefined) task.deadline = deadline;  // Only update deadline if it's provided

    // Save the updated task
    const updatedTask = await task.save();

    console.log("Updated Task in DB:", updatedTask); // Debug log

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  const taskId = params.id;

  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.id;

    console.log("Request to delete task:", taskId); // Debug log

    await connectDB();

    const task = await Task.findOne({ _id: taskId, studentId });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Delete the task
    await task.deleteOne();

    console.log("Deleted Task:", taskId); // Debug log

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
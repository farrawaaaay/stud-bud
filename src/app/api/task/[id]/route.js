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

    const { status } = await request.json();

    console.log("Request to update task:", taskId); // Debug log
    console.log("New Status:", status); // Debug log

    await connectDB();

    const task = await Task.findOne({ _id: taskId, studentId });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (status) task.status = status;

    const updatedTask = await task.save();

    console.log("Updated Task in DB:", updatedTask); // Debug log

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

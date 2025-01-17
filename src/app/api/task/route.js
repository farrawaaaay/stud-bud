import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";

export async function POST(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]; // Extract token from Authorization header

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
    const { title, content, category, deadline, status } = await request.json();

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ["to-do", "in-progress", "completed"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed values: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Create a new task
    const task = new Task({
      title,
      content,
      category,
      studentId, // Add the studentId from the token
      deadline: deadline ? new Date(deadline) : null, // Parse deadline if provided
      status: status || "to-do", // Default to "to-do"
    });

    // Save the task to the database
    const savedTask = await task.save();

    return NextResponse.json(savedTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request) {
    try {
      // Step 1: Validate token
      const token = request.headers.get("Authorization")?.split(" ")[1];
      if (!token) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const studentId = decoded.id;
  
      // Step 2: Connect to the database
      await connectDB();
  
      // Step 3: Retrieve all tasks belonging to the authenticated student
      const tasks = await Task.find({ studentId }).sort({ deadline: 1 }); // Sort by deadline
  
      // Step 4: Return the tasks
      return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
  
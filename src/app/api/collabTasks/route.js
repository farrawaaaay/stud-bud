import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import CollabTask from "@/models/CollabTasks";
import Workspace from "@/models/Workspace";
import Student from "@/models/Student";

export async function POST(request) {
    try {
      const token = request.headers.get("Authorization")?.split(" ")[1];
  
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { id: studentId } = decoded;
  
      if (!studentId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
  
      const { taskTitle, taskDescription, workspaceId, assigneeId, deadline } = await request.json();

    if (!taskTitle || !taskDescription || !workspaceId || !assigneeId) {
    console.log("Missing fields:", { taskTitle, taskDescription, workspaceId, assigneeId });
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
  
      await connectDB();
  
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
      }
  
      if (!workspace.members.includes(assigneeId)) {
        return NextResponse.json({ error: "Assignee is not a member of this workspace" }, { status: 403 });
      }

      
  
      const assignor = await Student.findById(studentId).select("name");
      const assignee = await Student.findById(assigneeId).select("name");
  
      if (!assignor || !assignee) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      const newCollabTask = new CollabTask({
        title: taskTitle,
        description: taskDescription,
        workspace: workspaceId,
        assignor: studentId,
        assignee: assigneeId,
        deadline: deadline, 
      });
  
      const savedTask = await newCollabTask.save();
  
      return NextResponse.json({
        _id: savedTask._id,
        title: savedTask.title,
        description: savedTask.description,
        status: savedTask.status,
        workspace: savedTask.workspace,
        assignor: { _id: savedTask.assignor, name: assignor.name },
        assignee: { _id: savedTask.assignee, name: assignee.name },
        createdAt: savedTask.createdAt,
        deadline: savedTask.deadline,
      }, { status: 201 });
    } catch (error) {
      console.error("Error creating task:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
  

export async function GET(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: studentId } = decoded;

    if (!studentId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const url = new URL(request.url);
    const workspaceId = url.searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    await connectDB();

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    if (!workspace.members.includes(studentId)) {
      return NextResponse.json({ error: "You are not a member of this workspace" }, { status: 403 });
    }

    const tasks = await CollabTask.find({ workspace: workspaceId }).populate("assignor assignee", "name");

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function PUT(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: studentId } = decoded;

    if (!studentId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { taskId, newStatus } = await request.json();

    if (!taskId || !newStatus) {
      return NextResponse.json({ error: "Task ID and new status are required" }, { status: 400 });
    }

    await connectDB();

    const task = await CollabTask.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (!["TODO", "IN_PROGRESS", "COMPLETED"].includes(newStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    task.status = newStatus;
    const updatedTask = await task.save();

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: studentId } = decoded;

    if (!studentId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { taskId } = await request.json();

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    await connectDB();

    const task = await CollabTask.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.assignor.toString() !== studentId) {
      return NextResponse.json({ error: "You are not the assignor of this task" }, { status: 403 });
    }

    await task.remove();

    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

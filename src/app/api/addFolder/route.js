// pages/api/addFolder.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Folder from "@/models/Folder";

export async function POST(request) {
  try {
    // Step 1: Extract token from the Authorization header
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: studentId } = decoded;

    if (!studentId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Step 3: Parse the request body
    const { folderName } = await request.json();

    // Step 4: Validate required fields
    if (!folderName) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }

    // Step 5: Connect to the database
    await connectDB();

    // Step 6: Create a new folder
    const newFolder = new Folder({
      folderName,
      studentID: studentId, // Use studentId from token
    });

    // Step 7: Save the folder to the database
    const savedFolder = await newFolder.save();

    // Step 8: Return success response
    return NextResponse.json(
      { message: "Folder added successfully", folder: savedFolder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding folder:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

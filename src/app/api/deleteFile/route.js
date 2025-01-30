import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import File from "@/models/File";

export const DELETE = async (req) => {
  try {
    // Extract the file ID from the URL
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }

    // Get JWT token from headers
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Verify JWT and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.id;

    // Connect to the database
    await connectDB();

    // Find the file and verify ownership
    const file = await File.findOne({ _id: fileId, studentId });
    if (!file) {
      return NextResponse.json({ error: "File not found or unauthorized" }, { status: 404 });
    }

    // Delete the file entry from the database only
    await File.deleteOne({ _id: fileId });

    return NextResponse.json({ message: "File record deleted successfully from database" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

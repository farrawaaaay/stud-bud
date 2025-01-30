import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Assuming you have a Student model
      required: true,
    },
    deadline: {
      type: Date, // ISO date format for deadlines
      required: false, // Optional, if not all tasks have a deadline
    },
    status: {
      type: String,
      enum: ["to-do", "in-progress", "completed"], // Predefined values
      default: "to-do", // Default value
      required: true,
    },
    
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;

import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student', // Reference to the student model
      required: true,
    }
  },
  { timestamps: true } // Add timestamps option to auto-generate createdAt and updatedAt fields
);

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;

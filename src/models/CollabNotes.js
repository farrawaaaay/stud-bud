import mongoose from "mongoose";

const CollabNoteSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: {
    type: String,
    required: true,
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
}, { timestamps: true });

const CollabNote = mongoose.models.CollabNote || mongoose.model("CollabNote", CollabNoteSchema);
export default CollabNote;

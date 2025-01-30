import mongoose from 'mongoose';

const collabTaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
    assignor: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    status: { type: String, default: "TODO" },
    deadline: Date, // Add this line
  }, { timestamps: true });

// Check if the model is already defined, if not, define it
const CollabTask = mongoose.models.CollabTask || mongoose.model('CollabTask', collabTaskSchema);

export default CollabTask;

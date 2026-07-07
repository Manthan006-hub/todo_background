const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  mentions: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  color: { type: String, default: null }, // Default is null so backend can assign a color
  status: { type: String, enum: ["todo", "inProgress", "done"], default: "todo" },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  dueDate: { type: Date, default: null },
  comments: [CommentSchema],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
});

module.exports = mongoose.model("Note", NoteSchema);

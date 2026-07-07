const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  color: { type: String, default: null }, // Default is null so backend can assign a color
  status: { type: String, enum: ["todo", "inProgress", "done"], default: "todo" },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  dueDate: { type: Date, default: null }
});

module.exports = mongoose.model("Note", NoteSchema);

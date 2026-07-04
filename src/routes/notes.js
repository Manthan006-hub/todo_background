const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// Define an array of colors to assign randomly
const colors = ["#FFEB3B", "#90CAF9", "#EF9A9A", "#FFCC80", "#E0E0E0"];

// 🟢 Get All Notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔵 Create a Note with Random Color
router.post("/", async (req, res) => {
  try {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const note = new Note({
      title: req.body.title,
      content: req.body.content,
      color: req.body.color || randomColor, // Assign a random color if not provided
      status: req.body.status || "todo",
      priority: req.body.priority || "Medium",
      dueDate: req.body.dueDate || null,
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🟡 Update a Note
router.put("/:id", async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔴 Delete a Note
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

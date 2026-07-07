const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const auth = require("../middleware/auth");

// Define an array of colors to assign randomly
const colors = ["#FFEB3B", "#90CAF9", "#EF9A9A", "#FFCC80", "#E0E0E0"];

const normalizeComments = (comments = []) => {
  return comments.map((comment) => ({
    text: comment.text,
    author: comment.author || "Anonymous",
    mentions: Array.isArray(comment.mentions) ? comment.mentions : [],
    createdAt: comment.createdAt || new Date(),
    updatedAt: comment.updatedAt || new Date()
  }));
};

router.use(auth);

// 🟢 Get All Notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user._id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔵 Get a single note
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
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
      comments: normalizeComments(req.body.comments),
      owner: req.user._id,
      projectId: req.body.projectId || null,
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
    const updateData = { ...req.body };
    delete updateData.owner;
    delete updateData._id;

    if (req.body.comments) {
      updateData.comments = normalizeComments(req.body.comments);
    }

    const updatedNote = await Note.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, updateData, { new: true });
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 💬 Get comments for a note
router.get("/:noteId/comments", async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.noteId, owner: req.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 💬 Add a comment to a note
router.post("/:noteId/comments", async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.noteId, owner: req.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const newComment = {
      text: req.body.text,
      author: req.body.author || "Anonymous",
      mentions: Array.isArray(req.body.mentions) ? req.body.mentions : [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    note.comments.push(newComment);
    await note.save();
    res.status(201).json(note.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 💬 Update a comment on a note
router.put("/:noteId/comments/:commentId", async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.noteId, owner: req.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const comment = note.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (req.body.text !== undefined) comment.text = req.body.text;
    if (req.body.author !== undefined) comment.author = req.body.author;
    if (req.body.mentions !== undefined) comment.mentions = req.body.mentions;
    comment.updatedAt = new Date();

    await note.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 💬 Delete a comment from a note
router.delete("/:noteId/comments/:commentId", async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.noteId, owner: req.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.comments.id(req.params.commentId)?.remove();
    await note.save();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔴 Delete a Note
router.delete("/:id", async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

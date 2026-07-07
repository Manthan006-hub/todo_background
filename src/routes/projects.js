const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ $or: [{ owner: req.user._id }, { members: req.user._id }] });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      owner: req.user._id,
      members: req.body.members || [],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

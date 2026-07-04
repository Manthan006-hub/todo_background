const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.log("❌ MongoDB connection error:", error));

app.use("/api/notes", require("./routes/notes")); // Route for Notes

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

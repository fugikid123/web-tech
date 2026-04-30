const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/hypertrophyDB', {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.log("Make sure MongoDB is installed and running on port 27017");
  }
};

connectDB();

// Middleware to check DB connection
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected. Please ensure MongoDB is running." });
  }
  next();
});

// Define Signup Schema based on Hypertrophy Page Form
const signupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  email: { type: String, required: true },
  level: { type: String, required: true },
  days: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Signup = mongoose.model("Signup", signupSchema);

// API ROUTES

// 1. Create Signup (POST)
app.post('/api/signup', async (req, res) => {
  try {
    const signup = new Signup(req.body);
    await signup.save();
    res.status(201).json({ message: "Signup successful!", data: signup });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Get All Signups (GET)
app.get('/api/signups', async (req, res) => {
  try {
    const signups = await Signup.find().sort({ createdAt: -1 });
    res.status(200).json(signups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Delete a Signup (DELETE) - Optional but good for management
app.delete('/api/signup/:id', async (req, res) => {
  try {
    const signup = await Signup.findByIdAndDelete(req.params.id);
    if (!signup) return res.status(404).send("Signup not found");
    res.status(200).send("Signup deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require("express");
const Router = express.Router();
const User = require("../models/user.model");
const Session = require("../models/session.model");

Router.post("/", async (req, res) => {
  try {
    const { subject, date, studentId, tutorId } = req.body;

    // Validate input
    if (!subject || !date || !studentId || !tutorId) {
      return res.status(400).json({
        message: "Please provide subject, date, studentId, and tutorId",
      });
    }
    
    // Validate that the date is in the future
    const sessionDate = new Date(date);
    const currentDate = new Date();
    
    if (sessionDate <= currentDate) {
      return res.status(400).json({
        message: "Session date must be in the future",
        providedDate: sessionDate,
        currentDate: currentDate
      });
    }

    // Check if both users exist
    const student = await User.findById(studentId);
    const tutor = await User.findById(tutorId);

    if (!student || !tutor) {
      return res.status(404).json({
        message: "One or both users do not exist",
        studentExists: !!student,
        tutorExists: !!tutor,
      });
    }

    // Verify roles
    if (student.role !== "student") {
      return res.status(400).json({
        message: "The provided studentId does not belong to a student",
      });
    }

    if (tutor.role !== "tutor") {
      return res
        .status(400)
        .json({ message: "The provided tutorId does not belong to a tutor" });
    }

    // Create new session using Session.create()
    const newSession = await Session.create({
      subject,
      date: sessionDate,  // Using the already validated date
      studentId,
      tutorId,
    });

    res.status(201).json({
      message: "Session created successfully",
      session: newSession,
    });
  } catch (error) {
    console.error("Session creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = Router;



// Register Route
Router.post("/register", async (req, res) => {
  try {
    const { username, email, role } = req.body;

    // Validate input
    if (!username || !email) {
      return res
        .status(400)
        .json({ message: "Please provide username and email..." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      role: role || "student",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Update Student Route
Router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;

    // Validate input
    if (!username && !email && !role) {
      return res
        .status(400)
        .json({ message: "No fields provided for update" });
    }

    // Update student details
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Delete Student Route
Router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete student
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.error("Delete error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = Router;
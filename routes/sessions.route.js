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
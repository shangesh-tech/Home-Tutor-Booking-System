const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Session", sessionSchema);

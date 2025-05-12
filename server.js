const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const userRoutes = require('./routes/student.route')
const sessionRoutes = require('./routes/sessions.route')
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Home Tutor Booking System API",
    endpoints: {
      register: "POST /register - Register a new user",
      sessions: "POST /sessions - Create a new tutoring session",
    },
  });
});

app.use("/api/user",userRoutes)
app.use('/api/session',sessionRoutes)

// DB connection

connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  );
});

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("Connected to database!");
//     app.listen(process.env.PORT, () => {
//       console.log(`Server is running on port ${process.env.PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Connection failed!", error);
//   });

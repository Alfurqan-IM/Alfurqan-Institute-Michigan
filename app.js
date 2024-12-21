require("dotenv").config();
require("express-async-errors");
// server
const express = require("express");
const app = express();
const port = process.env.PORT || 5005;
const connectDB = require("./models");
const path = require("path");

// security
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");

// Always restrict CORS to specific origins in production.
// Use environment variables to dynamically configure the allowed origin based on the environment (development or production).
// Avoid allowing all origins (*) in production to prevent unauthorized access.
//middleware
app.use(express.json());
const morgan = require("morgan");
app.use(morgan("dev"));
const passport = require("passport");
require("./middleware/passportConfig");

// Error Handling Middleware
const notFound = require("./middleware/notFoundError");
const errorHandlerMiddleware = require("./middleware/errorHandler");

//cookie
const cookieParser = require("cookie-parser");

// use Cookie
app.use(cookieParser(process.env.JWT_SECRET));

// uplaod files
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

// Router
const authRoutes = require("./routes/authFlowRouter");
const bannerRoutes = require("./routes/bannerRoutes");
const enquiriesRoutes = require("./routes/enquiryRoutes");
const programmesRoutes = require("./routes/programmesRouter");
const programmesRegRoutes = require("./routes/programmeRegRouter");
const feedbackRoutes = require("./routes/feedbackRouter");
const surahRoutes = require("./routes/surahRouter");
const usersRoutes = require("./routes/usersRouter");

// use passport config
app.use(passport.initialize());

// use upload
app.use(fileUpload({ useTempFiles: true }));
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//  google auth
app.get("/", (req, res) => {
  res.send('<a href="/api/v1/authentication/google">login with google</a>');
});

// use Routes
app.use("/api/v1/authentication", authRoutes);
app.use("/api/v1/banners", bannerRoutes);
app.use("/api/v1/enquiries", enquiriesRoutes);
app.use("/api/v1/programmes", programmesRoutes);
app.use("/api/v1/registerations", programmesRegRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/surah", surahRoutes);
app.use("/api/v1/users", usersRoutes);

//Error Handling Middleware for routes and interacting with the database
app.use(notFound);
app.use(errorHandlerMiddleware);

// connect to DB and start Server
// const x = 92;
connectDB.sequelize
  .sync()
  .then(() => {
    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(
      "Error synchronizing Sequelize models with the database:",
      error
    );
  });

require("dotenv").config();
require("express-async-errors");
// server
const express = require("express");
const app = express();
const port = process.env.PORT || 5005;
const connectDB = require("./models");
const path = require("path");
// uplaod files
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

// security
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");

//middleware
// require("./middlewares/customErrors/passportConfig");
app.use(express.json());
const morgan = require("morgan");
app.use(morgan("dev"));
const passport = require("passport");

// Error Handling Middleware
const notFound = require("./middleware/notFoundError");
const errorHandlerMiddleware = require("./middleware/errorHandler");

//cookie
const cookieParser = require("cookie-parser");

//Error Handling Middleware for routes and interacting with the database
app.use(notFound);
app.use(errorHandlerMiddleware);

// connect to DB and start Server
const x = 92;
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

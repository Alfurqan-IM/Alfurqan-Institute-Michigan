require("dotenv").config();
require("express-async-errors");
// server
const express = require("express");
const app = express();
const port = process.env.PORT || 5005;
const connectDB = require("./models");
const path = require("path");

// webhook connection
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app); // Create HTTP server for Socket.IO

// ✅ Apply CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.PRODUCTION_URL,
    // origin: "http://localhost:3000", // Adjust based on frontend URL
//     origin:
//       process.env.NODE_ENV === "production"
//         ? process.env.PRODUCTION_URL
//         : "http://localhost:3000,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Handle Socket.io Connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
// Attach Socket.IO instance to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// security
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");

// cors config
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests from localhost or 127.0.0.1 with any port
    if (
      origin &&
      (origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1"))
    ) {
      callback(null, true);
    } else if (origin === undefined || origin === process.env.PRODUCTION_URL) {
      // Allow production domain or non-browser requests (like Postman)
      callback(null, true);
    } else {
      // Block other origins
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies or credentials
};
app.use(cors(corsOptions));

//middleware
// app.use(express.json());
const morgan = require("morgan");
app.use(morgan("dev"));
// app.use(helmet()); // Security headers
app.use(xss()); // Prevent XSS attacks
const passport = require("passport");
require("./middleware/passportConfig");

// Capture raw body for signature validation
const bodyParser = require("body-parser");
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

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

// rate limiter
const { loginLimiter, apiLimiter } = require("./utils/limiter");
app.set("trust proxy", 1);
app.use(apiLimiter);

// Router
const authRoutes = require("./routes/authFlowRouter");
const bannerRoutes = require("./routes/bannerRoutes");
const enquiriesRoutes = require("./routes/enquiryRoutes");
const programmesRoutes = require("./routes/programmesRouter");
const programmesRegRoutes = require("./routes/programmeRegRouter");
const feedbackRoutes = require("./routes/feedbackRouter");
const surahRoutes = require("./routes/surahRouter");
const usersRoutes = require("./routes/usersRouter");
const campaignRoutes = require("./routes/campaignRouter");
const eventRoutes = require("./routes/eventsRouter");
const donationRoutes = require("./routes/donationsRouter");

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
// app.get("/", (req, res) => {
//   res.send('<a href="/api/v1/authentication/google">login with google</a>');
// });

app.get("/", (req, res) => {
  res.send("API is running and accepting requests.");
});

// use Routes
app.use("/api/v1/authentication", loginLimiter, authRoutes);
app.use("/api/v1/banners", bannerRoutes);
app.use("/api/v1/enquiries", enquiriesRoutes);
app.use("/api/v1/programmes", programmesRoutes);
app.use("/api/v1/registerations", programmesRegRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/surah", surahRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/campaigns", campaignRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/donations", donationRoutes);

//Error Handling Middleware for routes and interacting with the database
app.use(notFound);
app.use(errorHandlerMiddleware);

// connect to DB and start Server
connectDB.sequelize
  .sync()
  .then(() => {
    // Start the Express server
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(
      "Error synchronizing Sequelize models with the database:",
      error
    );
  });

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const postRoutes = require("./routes/postRoutes");
const clipsRoutes = require("./routes/clipsRoutes");
const storyRoutes = require("./routes/storyRoutes");
const musicRoutes = require("./routes/musicRoutes");
const storageRoutes = require("./routes/storageRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { myDbConnection } = require("./db/connection");
const generateToken = require("./utils/generateToken");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const port = 4000;
require("./Authentication/googleAuth");
require("./Authentication/twitterAuth");

myDbConnection();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

// Initialize express-session before passport.initialize

app.use(cookieParser("Rk8%&7wP3z$Q2tY!a@S#vG5bU9rK6mN"));
app.use(
  session({
    secret: "Rk8%&7wP3z$Q2tY!a@S#vG5bU9rK6mN", // Replace with a strong and secure secret
    cookie: {
      secure: false,
    },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Starting Socket.IO
const socket = require("./utils/socket.js");
const server = require("http").createServer(app);
socket.init(server);
// --------------

// Now, set up your Google authentication routes and other middleware as needed.

// Google authentication
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/store-token",
    failureRedirect: "/auth/google/failure",
  })
);

// Twitter authentication
app.get("/auth/twitter", passport.authenticate("twitter"));

app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: "/api/store-token",
    failureRedirect: "/auth/twitter/failure",
  })
);

// Store the Twitter access token in a secure location (e.g., session)
app.get("/api/store-token", (req, res) => {
  const accessToken = generateToken(req.user._id);
  req.session.token = accessToken;
  const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  res.cookie("gfoliotoken", accessToken, {
    maxAge: twelveHours,
    httpOnly: false,
  });
  // res.redirect("http://localhost:3000/main");
  res.redirect(`${process.env.BASE_URL}/main`);
});

app.get("/main", (req, res) => {
  res.send("Successfully authenticated");
});

// User API
app.use("/api/admin", adminRoutes);

// User API
app.use("/api/user", userRoutes);

// Post API
app.use("/api/post", postRoutes);

// Clips API
app.use("/api/clip", clipsRoutes);

// Story API
app.use("/api/stories", storyRoutes);

// Music API
app.use("/api/music", musicRoutes);

// AWS S3 Storage API
app.use("/api/storage", storageRoutes);

// Chat API
app.use("/api/v1/chat", chatRoutes);

app.get("/api/user/protected", authMiddleware, (req, res) => {
  // Access protected resource
  res.json({ message: "Success" });
});

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = { app };

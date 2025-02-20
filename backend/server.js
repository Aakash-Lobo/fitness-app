require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "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",
    resave: false,
    saveUninitialized: true,
  })
);


// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // For manual registration
  googleId: String, // For Google OAuth
  avatar: String,
});
const User = mongoose.model("User", UserSchema);

// Local Strategy for Manual Registration/Login
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    const user = await User.findOne({ email });
    if (!user) return done(null, false, { message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: "Incorrect password" });

    return done(null, user);
  })
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          avatar: profile.photos[0].value,
          email: profile.emails[0].value,
        });
      }

      return done(null, user);
    }
  )
);

// Serialize & Deserialize User
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Manual Registration Route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  res.json({ message: "User registered successfully", user: newUser });
});

// Manual Login Route
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Logged in successfully", user: req.user });
});

// Google OAuth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/register",
    failureRedirect: "/auth/failure",
  })
);

// Get Authenticated User
app.get("/auth/user", (req, res) => {
  res.json(req.user || null);
});

// Logout Route
app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.redirect("http://localhost:3000/register");
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

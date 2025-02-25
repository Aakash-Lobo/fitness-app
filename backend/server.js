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
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  dob: { type: String }, 
  address: { type: String }, 
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ["user", "admin", "trainer"], default: "user" },
  status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
});

const User = mongoose.model("User", UserSchema);

// Local Strategy for Manual Registration/Login
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    const user = await User.findOne({ email });
    if (!user) return done(null, false, { message: "User not found" });

    if (user.status === "pending") {
      return done(null, false, { message: "Your account is pending approval." });
    }

    if (user.status === "declined") {
      return done(null, false, { message: "Your account has been declined." });
    }

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
      callbackURL: "http://localhost:5001/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          status: "pending",
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
  try {
      const { name, email, password } = req.body;

      // Check if user already exists
      let existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user with 'pending' status
      const newUser = new User({
          name,
          email,
          password: hashedPassword,
          role: "user",  // Default role is "user"
          status: "pending" // Default status is "pending"
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully. Waiting for admin approval." });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
});




// Manual Login Route
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (!user) return res.status(400).json({ message: info.message }); // Return status message

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ message: "Login failed" });

      return res.json({
        message: "Logged in successfully",
        user: {
          name: user.name,
          email: user.email,
          status: user.status,
          role: user.role,
        },
      });
    });
  })(req, res, next);
});


// Google OAuth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("http://localhost:3000/login?error=unauthorized");
    }

    if (req.user.status === "pending") {
      return res.redirect("http://localhost:3000/login?error=pending");
    } else if (req.user.status === "declined") {
      return res.redirect("http://localhost:3000/login?error=declined");
    }

    // Redirect based on user role
    if (req.user.role === "admin") {
      return res.redirect("http://localhost:3000/roles/admin/admindashboard");
    } else if (req.user.role === "trainer") {
      return res.redirect("http://localhost:3000/trainer-dashboard");
    } else {
      return res.redirect("http://localhost:3000/roles/User/userdashboard");
    }
  }
);


// Get Authenticated User
app.get("/auth/user", (req, res) => {
  if (req.user) {
    res.json({
      name: req.user.name,
      avatar: req.user.avatar,
      status: req.user.status,
      role: req.user.role,
    });
  } else {
    res.json(null);
  }
});


// Logout Route
app.post("/logout", (req, res) => {
  res.clearCookie("connect.sid"); // Clear session cookie
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});


app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find(); // Adjust if needed
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.put("/admin/update-status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    console.log("Received request for user:", userId, "Status:", status); // Debugging

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.json({ message: "User status updated successfully", status: user.status });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

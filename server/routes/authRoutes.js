const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const requireAuth = require("../middleware/auth");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PROFILE_FIELDS = ["age", "height", "weight", "goal", "level"];

const signToken = (user) =>
  jwt.sign({ sub: String(user._id) }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (u) => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
  profile: {
    age: u.profile?.age || "",
    height: u.profile?.height || "",
    weight: u.profile?.weight || "",
    goal: u.profile?.goal || "Weight Loss",
    level: u.profile?.level || "Beginner",
  },
});

const pickProfile = (src = {}) =>
  Object.fromEntries(
    PROFILE_FIELDS.filter((k) => src[k] !== undefined).map((k) => [k, String(src[k])])
  );

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, profile } = req.body || {};

  if (!name?.trim()) return res.status(400).json({ error: "Name is required." });
  if (!EMAIL_RE.test(email || "")) return res.status(400).json({ error: "Enter a valid email." });
  if (typeof password !== "string" || password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." });

  const key = email.trim().toLowerCase();
  if (await User.findOne({ email: key }))
    return res.status(409).json({ error: "An account with this email already exists." });

  const user = await User.create({
    name,
    email: key,
    passwordHash: await bcrypt.hash(password, 10),
    profile: pickProfile(profile),
  });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const key = String(email || "").trim().toLowerCase();

  const user = await User.findOne({ email: key }).select("+passwordHash");
  if (!user) return res.status(401).json({ error: "No account found with this email." });

  const ok = await bcrypt.compare(String(password || ""), user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Incorrect password." });

  res.json({ token: signToken(user), user: publicUser(user) });
});

// GET /api/auth/me  (validates a saved token)
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ error: "Account no longer exists." });
  res.json({ user: publicUser(user) });
});

// PUT /api/auth/profile
router.put("/profile", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ error: "Account no longer exists." });

  Object.assign(user.profile, pickProfile(req.body));
  await user.save();
  res.json({ user: publicUser(user) });
});

module.exports = router;

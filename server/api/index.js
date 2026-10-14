const mongoose = require("mongoose");
const createApp = require("../createApp");

// Cache the connection across serverless invocations (Vercel keeps the
// container warm for a while, so we avoid reconnecting on every request).
let connected = false;

const app = createApp();

module.exports = async (req, res) => {
  if (!connected) {
    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) {
      return res.status(500).json({ error: "MONGODB_URI is not configured." });
    }
    await mongoose.connect(MONGODB_URI);
    connected = true;
  }
  return app(req, res);
};


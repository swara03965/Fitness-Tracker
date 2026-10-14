require("dotenv").config();

const mongoose = require("mongoose");
const createApp = require("./createApp");

const { MONGODB_URI, JWT_SECRET } = process.env;
const PORT = process.env.PORT || 5000; // Render provides PORT

if (!MONGODB_URI || !JWT_SECRET) {
  console.error("Missing MONGODB_URI or JWT_SECRET. Copy .env.example to .env and fill them in.");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const db = mongoose.connection.name;
    console.log(`MongoDB connected. Database: "${db}" (collections: users, workouts)`);
    if (db === "test")
      console.warn('⚠️  Using the default "test" database. Add a name to MONGODB_URI, e.g. ...mongodb.net/fittrack?retryWrites=true')
    createApp().listen(PORT, () => console.log(`FitTrack API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

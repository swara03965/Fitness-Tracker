const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    sets: { type: Number, default: 3 },
    reps: { type: Number, default: 10 },
    calories: { type: Number, required: true, min: 0 },
    minutes: { type: Number, default: 0, min: 0 },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  },
  { timestamps: true }
);

// Send `id` (not `_id`) to the frontend and never leak internals.
workoutSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.userId;
    return ret;
  },
});

module.exports = mongoose.model("Workout", workoutSchema);

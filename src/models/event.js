import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: String, required: true },
  trail: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Event", EventSchema);

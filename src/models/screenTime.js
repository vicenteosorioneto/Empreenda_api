import mongoose from "mongoose";

const ScreenTimeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  screenName: { type: String, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  duration: { type: Number, required: true }, // em segundos
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ScreenTime", ScreenTimeSchema);

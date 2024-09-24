import mongoose, { Mongoose } from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    text: { type: String },
    time: { type: Date, default: Date.now() },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, //pointing out the other user
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("chat", chatSchema);

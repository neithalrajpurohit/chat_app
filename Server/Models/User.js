import mongoose, { Mongoose } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    isOnline: { type: Boolean, default: false },
    socketId: { type: String },
    recentMessage: { type: String },
    time: { type: Date },
    isSeen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("user", UserSchema);

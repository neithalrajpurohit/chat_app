import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./db.config.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./Models/User.js";
import jwt from "jsonwebtoken";
import Chats from "./Models/Chats.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

app.use(express.json());
dotenv.config();
connectDB(); //calling DB

httpServer.listen(9000, () => {
  console.log("server running on 9000");
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res
        .status(500)
        .json({ success: false, message: "name is mandatory" });
    }
    if (!email) {
      return res
        .status(500)
        .json({ success: false, message: "email is mandatory" });
    }
    if (!password) {
      return res
        .status(500)
        .json({ success: false, message: "password is mandatory" });
    }
    // encrypting password
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: encryptedPassword,
    });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    console.log(err);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(500)
        .json({ success: false, message: "email not registered" });
    }
    if (!password) {
      return res
        .status(500)
        .json({ success: false, message: "Please enter your password" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "email not registered" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(500)
        .json({ success: false, message: "Invalid Password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });
    return res.status(200).json({
      success: true,
      message: "Token Generated",
      data: token,
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
});
app.get("/get/allusers", async (req, res) => {
  try {
    const users = await User.find().sort("-time");
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "failed to get users" });
  }
});
app.post("/getUserInfo", async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: "user not found" });
  }
});

app.get("/message/:userId/:remoteUserId", async (req, res) => {
  try {
    const { userId, remoteUserId } = req.params;
    console.log(req.params);
    const messages = await Chats.find({
      $or: [{ user: userId }, { user: remoteUserId }],
    })
      .populate("user")
      .sort("-createdAt");

    return res.status(200).json({ success: true, data: messages });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "message not found" });
  }
});

// socket code
io.on("connection", (socket) => {
  let users = [];

  socket.on("joinroom", async (userData) => {
    console.log(userData, "jiib");
    let user = await User.findById(userData.user._id);
    user.isOnline = true;
    user.socketId = socket.id;
    await user.save();

    let isAlreadyJoined = users.find(
      (joinedUser) => joinedUser._id === user._id
    );
    if (!isAlreadyJoined) {
      users.push(user);
    }
    io.emit("users");
  });

  // listen for messages
  socket.on("message", async (data) => {
    const { from, to, message } = data;

    const messageToSave = message.map((message) => {
      return {
        text: message.text,
        user: message.user._id,
        createdAt: message.createdAt,
      };
    });

    //update user recent message
    await User.updateMany(
      { $or: [{ _id: from.user._id }, { _id: to._id }] },
      { $set: { recentMessage: message[0].text, time: Date.now() } }
    );

    await Chats.create(messageToSave[0]);

    io.to(to.socketId).emit("message", {
      from: from,
      to: to,
      message: message,
    });
    io.to(to.socketId).emit("users");
  });

  socket.on("disconnect", async () => {
    let user = await User.findOne({ socketId: socket.id });
    if (user) {
      user.isOnline = false;
      user.socketId = null;
      await user.save();
      users = users.filter((cuUser) => cuUser.socketId !== socket.id);
      io.emit("users");
    }
  });

  console.log("user connected", socket.id);
});

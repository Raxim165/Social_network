// // import mongoose from "mongoose";
// require('dotenv').config();
// const mongoose = require("mongoose");
// const l = console.log;
// const http = require("http");
// const express = require("express");
// const cookieParser = require("cookie-parser");
// const { nanoid } = require("nanoid");
// const bodyParser = require("body-parser");
// const bcrypt = require("bcrypt");
// const { MongoClient, ObjectId } = require("mongodb");
// const jwt = require("jsonwebtoken");
// const { Server } = require("socket.io");

// const User = mongoose.model("User", new mongoose.Schema({
//   username: String,
//   password: String
// }))

// const Message = mongoose.model("Message", new mongoose.Schema({
//   from: String,
//   to: String,
//   content: String,
//   timestamp: Date
// }))

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// const JWT_SECRET = 'secret123';


// app.use(express.json());
// app.use(cookieParser());

// mongoose.connect(process.env.DB_URI!);

// app.post("api/register", async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.create({ username, password });
//   res.json(user);
// })

// const client = new MongoClient(process.env.DB_URI, {
//   useUnifiedTopology: true,
//   maxPoolSize: 10,
// });

// (async () => {
//   try {
//     await client.connect();
//     const db = client.db("Data");
//     const res = await db.collection("users").find({}).toArray();
//     const res2 = await db.collection("timers").find({}).toArray();
//     l(res);
//     l(res2);
//   } catch (err) {
//     console.error(err);
//   }
// })()
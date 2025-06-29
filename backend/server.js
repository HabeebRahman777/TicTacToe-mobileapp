
import mongoose from 'mongoose';
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';
import dotenv from 'dotenv';
import  initSocket  from './socket.js';
import app from "./app.js";
import express from "express"

dotenv.config();
const PORT = process.env.PORT

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json())


mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.error(err));


initSocket(io);

httpServer.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

export {io}

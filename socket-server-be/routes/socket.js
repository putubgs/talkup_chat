const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN_URL,
    methods: ["GET", "POST"],
  },
});

const roomSizeMap = new Map();

io.on("connection", (socket) => {
  socket.on("join-room", (userId) => {
    const roomSize = roomSizeMap.get(userId) || 0;

    if (roomSize < 2) {
      socket.join(userId);
      roomSizeMap.set(userId, roomSize + 1);
      console.log(userId);
    } else {
      console.log(`Room ${userId} is full.`);
    }
  });

  socket.on("send-message", ({ text, sender, recipient }) => {
    const roomSize = roomSizeMap.get(recipient);
    console.log(
      `Sending message to room ${recipient}, current size: ${roomSize}`
    );

    if (roomSize) {
      io.to(recipient).emit("receive-message", {
        text,
        sender,
      });
    } else {
      console.error(`Cannot send message, room ${recipient} does not exist.`);
    }
  });

  socket.on("disconnect", () => {
    socket.rooms.forEach(roomId => {
      if (roomId !== socket.id) {
        const roomSize = roomSizeMap.get(roomId);
        if (roomSize) {
          roomSizeMap.set(roomId, roomSize - 1);
        }
      }
    });
  });  
});

// Moved error listener here
server.on("error", (error) => {
  console.error(`Server error: ${error}`);
});

module.exports = { app, server };

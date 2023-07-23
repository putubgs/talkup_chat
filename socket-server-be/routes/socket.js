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

// Initialize a map to keep track of room sizes
const roomSizeMap = new Map();

io.on("connection", (socket) => {
  socket.on("join-room", (userId) => {
    // Get the current room size
    const roomSize = roomSizeMap.get(userId) || 0;

    // If the room size is less than 2, allow the user to join
    if (roomSize < 2) {
      socket.join(userId);
      // Increment the room size in the map
      roomSizeMap.set(userId, roomSize + 1);
      console.log(userId)
    } else {
      console.log(`Room ${userId} is full.`);
    }
  });

  socket.on("send-message", ({text, sender, recipient}) => {
    io.to(recipient).emit("receive-message", {
      text,
      sender
    });
  });

  socket.on("disconnect", () => {
    // When a socket disconnects, decrement the room size
    // Only do this if the user was in a room
    socket.rooms.forEach(roomId => {
      const roomSize = roomSizeMap.get(roomId);
      if (roomSize) {
        roomSizeMap.set(roomId, roomSize - 1);
      }
    });
  });
});

module.exports = { app, server };

const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const debugPrint = require("../utils/debugPrint");


app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
    // console.log(socket)
    console.log("connected with socketid", socket.id)
    socket.on("send-to-all", (data) => {
        console.log(data)
    })
    socket.emit("send-from-server", {message: socket.id})
})
    


module.exports = { app, server };
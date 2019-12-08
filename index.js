const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let lastEmittedData = { racers: [] };

io.on("connection", socket => {
  console.info("New client connected");
  socket.emit("outgoing-data", lastEmittedData);

  socket.on("incoming-data", data => {
    console.info("received data: ", data);
    lastEmittedData = { racers: data };
    socket.broadcast.emit("outgoing-data", { racers: data });
  });

  socket.on("disconnect", () => console.info("Client disconnected"));
});

server.listen(port, () => console.info(`Listening on port ${port}`));

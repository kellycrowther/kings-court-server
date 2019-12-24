const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// pm2 start app.js
// pm2 save
// pm2 startup

// Update Security Rules for the app
// https://us-west-2.console.aws.amazon.com/ec2/home?region=us-west-2#SecurityGroups:search=sg-092aa28889858b7f2;sort=groupId
// When configuring the security group make sure you open the port on which your Node application will run

// ssh -i "LAComputer.pem" ubuntu@ec2-34-223-91-61.us-west-2.compute.amazonaws.com

app.get("/", function(req, res) {
  res.send("Hello World");
});

// let lastEmittedData = { racers: [] };
let races = [];

io.on("connection", socket => {
  console.info("New client connected");
  // socket.emit("outgoing-data", lastEmittedData);

  socket.on("incoming-data", data => {
    let raceToUpdate = races.findIndex(race => race && race.id === data.id);
    if (raceToUpdate !== -1) {
      races[raceToUpdate] = data;
    } else if (data.id !== "") {
      races.push(data);
    }

    socket.broadcast.emit("outgoing-data", { races: races });

    for (let race of races) {
      // may need to add a socket.on for the race.id to ensure i emit when a change occures
      // relying on incoming-data right now
      // could ensure client broadcasts on incoming-data
      socket.broadcast.emit(race.id, { race });
    }
  });

  socket.on("disconnect", () => console.info("Client disconnected"));
});

server.listen(port, () => console.info(`Listening on port ${port}`));

const http = require("http");

const { Server } = require("socket.io");

const express = require("express");
const app = express();

app.get("/test",(req,res) =>{
  res.send("test")
})

const server = http.createServer(app);


const io = new Server({
  cors: {
    origin: "*",
  },
});

var players = {};


//setInterval(()=>console.log(players),1500)

io.on("connect", (client) => {
  players[client.id] = { top: 0, left: 0 };

  io.emit("client", players);

  client.on("disconnect", () => {
    delete players[client.id];
    io.emit("players", players);
    io.emit("disconnected", client.id);
  });


  client.on("server", (data) => {
    data.id = client.id;
    players[client.id] = data;
    io.emit("client", players);
  });

});


//server.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = server;

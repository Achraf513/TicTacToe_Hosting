const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require("cors")
require('dotenv').config()
//test
const app = express();
app.use(cors());
const port = process.env.PORT || 8080
const server = http.createServer(app);

var allRooms = [];

app.use(express.static("./public/"));

const io = new Server(server, {
    cors: {
      origin: '*',
    }
  }
);
app.get('/', (req, res) => {
  res.sendFile("./public/index.html");
});
app.get('/roomExists',(req,res)=>{
  var response = allRooms.includes(req.query.roomId)?true:false;
  res.send({"response":response});
})
io.on('connection', (socket) => {
  var gameRoom = socket.id;
  socket.on("createRoom",(data)=>{
    gameRoom = data;
    allRooms.push(gameRoom);
    socket.join(gameRoom);
  });
  socket.on("joinRoom",(data)=>{
    gameRoom = data;
    socket.join(gameRoom);
  });
  socket.on("urTurn",(data)=>{
    socket.broadcast.to(gameRoom).emit("urTurn",data);
  });
  socket.on("iwon",(data)=>{
    socket.broadcast.to(gameRoom).emit("iwon",data);
  });
  socket.on("ready",(data)=>{
    socket.broadcast.to(gameRoom).emit("ready",data);
  });
});

server.listen(port, () => {
  console.log(`listening on :${port}`);
});
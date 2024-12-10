const express = require("express");
const app = express();
const http = require("http");

app.use(express.json());
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

const userSockets = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  userSockets[userId] = socket.id;
  console.log(userSockets);

  socket.on("disconnect", () => {
    delete userSockets[userId];
    console.log(`User ${userId} disconnected`);
  });
});

app.get('/new-message/:userId', (req, res) => {
    const userId = req.params.userId;
    const socketId = userSockets[userId];
    if(socketId){
        io.to(socketId).emit("new_message");
    }
    return res.json({
        "success": true
    })
});
app.get('/send-request/:userId', (req, res) => {
    const userId = req.params.userId;
    const socketId = userSockets[userId];
    if(socketId){
        io.to(socketId).emit("send_request");
    }
    return res.json({
        "success": true
    })
});
app.get('/accept-request/:userId', (req, res) => {
    const userId = req.params.userId;
    const socketId = userSockets[userId];
    if(socketId){
        io.to(socketId).emit("accept_request");
    }
    return res.json({
        "success": true
    })
});

// app.get("/", (req, res) => {
//   res.json({
//     ansar: true,
//   });
// });

server.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

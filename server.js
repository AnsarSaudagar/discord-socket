const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const redisClient = require("./config/redisClient");
const userRoutes = require("./routes/userRoutes");
const handleSocketConnection = require("./handlers/socketHandler");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Initialize Redis connection
(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }
})();

// Setup routes
app.use("/", userRoutes);

// Setup socket connection
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

handleSocketConnection(io);

// Start server
server.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

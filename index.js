const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const redis = require("redis");

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

const COLOR_KEY = "profile_color_";
const colorArr = [
  "#80848E",
  "#3BA55C",
  "#FAA81A",
  "#F47B67",
  "#ED4245",
  "#5865F2",
  "#EB459E",
  "#404EED",
];

// Create Redis client and connect
const redisClient = redis.createClient();
redisClient.on("error", (err) => console.error("Redis error:", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }
})();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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

app.get("/new-message/:userId", (req, res) => {
  const userId = req.params.userId;
  const socketId = userSockets[userId];
  if (socketId) {
    io.to(socketId).emit("new_message");
  }
  return res.json({ success: true });
});

app.get("/send-request/:userId", (req, res) => {
  const userId = req.params.userId;
  const socketId = userSockets[userId];
  if (socketId) {
    io.to(socketId).emit("send_request");
  }
  return res.json({ success: true });
});

app.get("/accept-request/:userId", (req, res) => {
  const userId = req.params.userId;
  const socketId = userSockets[userId];
  if (socketId) {
    io.to(socketId).emit("accept_request");
  }
  return res.json({ success: true });
});

app.get("/get-user-profile-color/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const key = COLOR_KEY + userId;
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      return res.json({ color: cachedData, source: "cache" });
    }

    const randomColor = colorArr[Math.floor(Math.random() * colorArr.length)];

    await redisClient.setEx(key, 3600, randomColor);

    res.json({ color: randomColor, source: "generated" });
  } catch (err) {
    console.error("Error retrieving color:", err);
    res.status(500).send("Server Error");
  }
});

app.post("/get-user-profile-colors", async (req, res) => {
  try {
    const userIds = req.body.ids; // Array of user IDs from the request body
    const colorData = await Promise.all(
      userIds.map(async (userId) => {
        const key = COLOR_KEY + userId;
        const cachedData = await redisClient.get(key);

        if (cachedData) {
          return { userId, color: cachedData, source: "cache" };
        }

        const randomColor =
          colorArr[Math.floor(Math.random() * colorArr.length)];
        await redisClient.setEx(key, 3600, randomColor);

        return { userId, color: randomColor, source: "generated" };
      })
    );

    res.json({ colorData });
  } catch (err) {
    console.error("Error retrieving colors:", err);
    res.status(500).send("Server Error");
  }
});

server.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

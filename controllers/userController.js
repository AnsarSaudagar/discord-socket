const redisClient = require("../config/redisClient");

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

// Controller for sending a new message
const sendNewMessage = (req, res) => {
  const userId = req.params.userId;
  const socketId = global.userSockets[userId];
  if (socketId) {
    global.io.to(socketId).emit("new_message");
  }
  res.json({ success: true });
};

// Controller for sending a request
const sendRequest = (req, res) => {
  const userId = req.params.userId;
  const socketId = global.userSockets[userId];
  if (socketId) {
    global.io.to(socketId).emit("send_request");
  }
  res.json({ success: true });
};

// Controller for accepting a request
const acceptRequest = (req, res) => {
  const userId = req.params.userId;
  const socketId = global.userSockets[userId];
  if (socketId) {
    global.io.to(socketId).emit("accept_request");
  }
  res.json({ success: true });
};

// Controller for getting a user's profile color
const getUserProfileColor = async (req, res) => {
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
};

// Controller for getting profile colors for multiple users
const getUserProfileColors = async (req, res) => {
  try {
    const userIds = req.body.ids;
    const colorData = await Promise.all(
      userIds.map(async (userId) => {
        const key = COLOR_KEY + userId;
        const cachedData = await redisClient.get(key);

        if (cachedData) {
          return { userId, color: cachedData, source: "cache" };
        }

        const randomColor = colorArr[Math.floor(Math.random() * colorArr.length)];
        await redisClient.setEx(key, 3600, randomColor);

        return { userId, color: randomColor, source: "generated" };
      })
    );

    res.json({ colorData });
  } catch (err) {
    console.error("Error retrieving colors:", err);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  sendNewMessage,
  sendRequest,
  acceptRequest,
  getUserProfileColor,
  getUserProfileColors,
};

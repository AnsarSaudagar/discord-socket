const userSockets = {};

const handleSocketConnection = (io) => {
  global.io = io; // Make io globally accessible for use in controllers
  global.userSockets = userSockets;

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    userSockets[userId] = socket.id;
    console.log(userSockets);

    socket.on("disconnect", () => {
      delete userSockets[userId];
      console.log(`User ${userId} disconnected`);
    });

    socket.on("offer", (data) => {
      socket.to(data.target).emit("offer", data);
    });

    socket.on("answer", (data) => {
      socket.to(data.target).emit("answer", data);
    });

    socket.on("ice-candidate", (data) => {
      socket.to(data.target).emit("ice-candidate", data);
    });
  });
};

module.exports = handleSocketConnection;

const redis = require("redis");


const redisClient = redis.createClient({
    // url: "redis://red-ctdjisaj1k6c73dqr8lg:6379"
  });
  
  redisClient.on("error", (err) => console.error("Redis error:", err));
  
  module.exports = redisClient;
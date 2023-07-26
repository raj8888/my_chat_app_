const redis = require("redis")
require('dotenv').config()

const client = redis.createClient({
    password: process.env.redisPass,
    socket: {
        host: process.env.redisHost,
        port: process.env.redisPort
    }
});

client.connect();

client.on("error", (error) => {
  console.log(error.message);
});
client.on("connect", () => {
  console.log("Connected to the redis cloud");
});
module.exports={client}
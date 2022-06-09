const socket = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  const indexPath = path.join(__dirname, "./index.html");
  const readStream = fs.createReadStream(indexPath);

  readStream.pipe(res);
});

const io = socket(server);
let i = 1;
io.on("connection", (client) => {
  console.log("Connected");
  const userName = 'user' + i;

  client.broadcast.emit("connection", userName);
  client.emit("connection", userName);
  i++;

  client.on("newMessage", (data) => {
    console.log(data);

    client.broadcast.emit("newMessage", data, userName);
    client.emit("newMessage", data, userName);
  });

  client.on("disconnect", (data) => {
    console.log(data);
    client.broadcast.emit("disconnection", userName);
    client.emit("disconnection", userName);
  });
});



server.listen(8085);
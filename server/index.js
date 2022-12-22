const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// if (process.env.NODE_ENV === "production") {
app.use(express.static(path.join(__dirname, "/client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
});
// } else {
//   app.get("/", (req, res) => {
//     res.send("API");
//   });
// }

io.on("connection", (socket) => {
  console.log("Connection estableshed with socket id: ", socket.id);

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("recieve_message", data);
  });
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with id: ${socket.id}, joined room: ${data} `);
  });

  socket.on("disconnect_user", (room) => {
    socket.leave(room);
    console.log("User disconnected from room: ", room);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected from socket: ", socket.id);
  });
});

// const port = process.env.PORT;
const port = 3001;

server.listen(port, () => {
  console.log(`server running at: ${port}`);
  // console.log(Object.keys(process.env));
});

// const port = 3001;

// server.listen(port, () => {
//   console.log(`server running at: ${port}`);
// });

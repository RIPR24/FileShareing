const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: {
    origin: "https://fileshareing-lxc7.onrender.com",
  },
});

let logs = [];

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    logs = logs.filter((el) => {
      el.sid !== socket.id;
    });
  });

  socket.on("join-room", (obj) => {
    const preuser = logs.findIndex((el) => obj.room === el.room);
    if (preuser >= 0) {
      io.to(logs[preuser].sid).emit("user-joined", obj);
      io.to(socket.id).emit("join-success", { ...obj, users: 2 });
      socket.join(obj.room);
      logs.splice(preuser, 1);
    } else {
      logs.push({ ...obj, sid: socket.id });
      socket.join(obj.room);
      io.to(socket.id).emit("join-success", { ...obj, users: 1 });
    }
  });

  socket.on("con-req", (obj) => {
    io.to(obj.win.room).emit("req-res", obj.off, socket.id);
  });

  socket.on("con-ans", (obj) => {
    io.to(obj.win.room).emit("ans-res", obj.ans, socket.id);
  });
});

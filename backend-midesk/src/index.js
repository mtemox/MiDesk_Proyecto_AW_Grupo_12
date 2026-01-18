import app from "./server.js";
import { connectDB } from "./database.js";
import http from "http";
import { Server } from "socket.io";
import { startRecommendationsCron } from "./jobs/recommendations.cron.js";

const start = async () => {
  await connectDB();
  startRecommendationsCron();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: "*" },
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("✅ Socket conectado:", socket.id);

    socket.on("join-user-room", (userId) => {
      socket.join(`user:${userId}`);
      console.log("👥 joined:", `user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket desconectado:", socket.id);
    });
  });

  server.listen(app.get("port"), () => {
    console.log(`server ok on http://localhost:${app.get("port")}`);
  });
};

start();

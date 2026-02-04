import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export const initSocket = (server: NetServer) => {
  if (!(server as any).io) {
    const io = new SocketIOServer(server, {
      path: "/api/socket",
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ Socket connected:", socket.id);

      socket.on("join-conversation", (conversationId: string) => {
        socket.join(conversationId);
      });

      socket.on("send-message", (message) => {
        io.to(message.conversationId).emit("new-message", message);
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
      });
    });

    (server as any).io = io;
  }
};

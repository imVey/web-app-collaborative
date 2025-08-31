import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? false
            : ["http://localhost:3000"],
        methods: ["GET", "POST"],
      },
    });
    res.socket.server.io = io;

    // Gestion des connexions
    io.on("connection", (socket) => {
      console.log(`🟢 Utilisateur connecté: ${socket.id}`);

      // Rejoindre une room
      socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId);
        console.log(`👥 ${userId} a rejoint la room ${roomId}`);
      });

      // Envoyer un message
      socket.on("send-message", (data) => {
        console.log("📨 Message reçu:", data);

        // Broadcast du message à tous les clients de la room
        if (data.roomId) {
          socket.to(data.roomId).emit("receive-message", {
            id: Date.now(),
            author: data.author,
            text: data.text,
            timestamp: new Date().toISOString(),
            userId: socket.id,
          });
        } else {
          // Broadcast global si pas de room spécifiée
          socket.broadcast.emit("receive-message", {
            id: Date.now(),
            author: data.author,
            text: data.text,
            timestamp: new Date().toISOString(),
            userId: socket.id,
          });
        }
      });

      // Notification de typing
      socket.on("typing", (data) => {
        socket.to(data.roomId || "general").emit("user-typing", {
          userId: socket.id,
          username: data.username,
          isTyping: data.isTyping,
        });
      });

      // Quitter une room
      socket.on("leave-room", (roomId, userId) => {
        socket.leave(roomId);
        socket.to(roomId).emit("user-disconnected", userId);
        console.log(`👋 ${userId} a quitté la room ${roomId}`);
      });

      // Gestion de la déconnexion
      socket.on("disconnect", () => {
        console.log(`🔴 Utilisateur déconnecté: ${socket.id}`);
        socket.broadcast.emit("user-disconnected", socket.id);
      });

      // Ping/Pong pour maintenir la connexion
      socket.on("ping", () => {
        socket.emit("pong");
      });
    });
  }
  res.end();
};

export default SocketHandler;

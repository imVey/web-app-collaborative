import { io } from "socket.io-client";

class SocketManager {
  constructor() {
    this.socket = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized && this.socket?.connected) {
      return this.socket;
    }

    try {
      // Initialiser l'API Socket.io
      await fetch("/api/socket");

      // Créer la connexion Socket.io
      this.socket = io({
        path: "/api/socket",
        addTrailingSlash: false,
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
      });

      this.setupEventHandlers();
      this.isInitialized = true;

      return this.socket;
    } catch (error) {
      console.error("Erreur lors de l'initialisation de Socket.io:", error);
      throw error;
    }
  }

  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ Socket.io connecté:", this.socket.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket.io déconnecté:", reason);

      // Reconnexion automatique si la déconnexion n'est pas intentionnelle
      if (reason === "io server disconnect") {
        console.log("🔄 Tentative de reconnexion...");
        this.socket.connect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Erreur de connexion Socket.io:", error);
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log(`✅ Reconnecté après ${attemptNumber} tentative(s)`);
    });

    this.socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Tentative de reconnexion ${attemptNumber}`);
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("❌ Erreur de reconnexion:", error);
    });
  }

  // Méthodes utilitaires
  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("Socket non connecté, impossible d'envoyer:", event);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  joinRoom(roomId, userId) {
    this.emit("join-room", roomId, userId);
  }

  leaveRoom(roomId, userId) {
    this.emit("leave-room", roomId, userId);
  }

  sendMessage(message) {
    this.emit("send-message", message);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isInitialized = false;
    }
  }

  get connected() {
    return this.socket?.connected || false;
  }

  get id() {
    return this.socket?.id;
  }
}

// Instance singleton
const socketManager = new SocketManager();

export default socketManager;

// Hook personnalisé pour React
export const useSocket = () => {
  return socketManager;
};

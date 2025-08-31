import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

let socket;

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: "Alice 🎨",
      text: "Salut l'équipe ! J'ai terminé le design de la page d'accueil",
      timestamp: new Date(Date.now() - 120000).toISOString(),
    },
    {
      id: 2,
      author: "Bob 💻",
      text: "Super ! J'ai intégré l'API PostgreSQL, on peut maintenant sauvegarder les données",
      timestamp: new Date(Date.now() - 60000).toISOString(),
    },
    {
      id: 3,
      author: "Charlie 🚀",
      text: "Excellent travail ! Les WebSockets fonctionnent parfaitement",
      timestamp: new Date().toISOString(),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const chatRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Messages automatiques pour la démo
  const demoMessages = [
    {
      author: "David 🎯",
      text: "On pourrait ajouter des notifications push ?",
    },
    { author: "Emma 📊", text: "J'ai mis à jour les métriques en temps réel" },
    {
      author: "Frank ⚡",
      text: "Performance optimisée ! Temps de chargement divisé par 2",
    },
    {
      author: "Grace 🔐",
      text: "Sécurité renforcée avec JWT et validation côté serveur",
    },
  ];

  let messageIndex = 0;

  useEffect(() => {
    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Auto-scroll vers le bas quand un nouveau message arrive
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const socketInitializer = async () => {
    try {
      await fetch("/api/socket");
      socket = io({
        path: "/api/socket",
        addTrailingSlash: false,
      });

      socket.on("connect", () => {
        console.log("✅ Connecté au serveur Socket.io");
        setIsConnected(true);
        setConnectedUsers((prev) => prev + 1);
      });

      socket.on("disconnect", () => {
        console.log("❌ Déconnecté du serveur Socket.io");
        setIsConnected(false);
      });

      socket.on("receive-message", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      socket.on("user-typing", (data) => {
        if (data.userId !== socket.id) {
          setIsTyping(data.isTyping);
        }
      });

      socket.on("user-connected", () => {
        setConnectedUsers((prev) => prev + 1);
      });

      socket.on("user-disconnected", () => {
        setConnectedUsers((prev) => Math.max(0, prev - 1));
      });
    } catch (error) {
      console.error("Erreur de connexion Socket.io:", error);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      const message = {
        author: "Vous 🎉",
        text: newMessage.trim(),
        roomId: "general",
      };

      // Ajouter immédiatement le message à l'état local
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          author: message.author,
          text: message.text,
          timestamp: new Date().toISOString(),
          userId: "local",
        },
      ]);

      // Envoyer via Socket.io
      socket.emit("send-message", message);

      setNewMessage("");

      // Simulation d'une réponse automatique après 1.5 secondes
      setTimeout(() => {
        if (messageIndex < demoMessages.length) {
          const autoMessage = {
            id: Date.now() + Math.random(),
            author: demoMessages[messageIndex].author,
            text: demoMessages[messageIndex].text,
            timestamp: new Date().toISOString(),
            userId: "auto",
          };

          setMessages((prev) => [...prev, autoMessage]);
          messageIndex++;
        }
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Gérer l'indicateur de frappe
    if (socket && e.target.value.length > 0) {
      socket.emit("typing", {
        roomId: "general",
        username: "Vous",
        isTyping: true,
      });

      // Arrêter l'indicateur après 1 seconde d'inactivité
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", {
          roomId: "general",
          username: "Vous",
          isTyping: false,
        });
      }, 1000);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes === 1) return "Il y a 1 minute";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} minutes`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "Il y a 1 heure";
    if (diffInHours < 24) return `Il y a ${diffInHours} heures`;

    return messageTime.toLocaleDateString("fr-FR");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Statut de connexion */}
      <div className="flex justify-between items-center mb-4 p-3 glass-effect rounded-lg">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            } animate-pulse`}
          ></div>
          <span className="text-sm text-slate-300">
            {isConnected ? "Connecté" : "Déconnecté"}
          </span>
        </div>
        <div className="text-sm text-slate-400">
          👥 {connectedUsers} utilisateur{connectedUsers > 1 ? "s" : ""} en
          ligne
        </div>
      </div>

      {/* Zone de chat */}
      <div
        ref={chatRef}
        className="glass-effect rounded-2xl p-6 h-96 overflow-y-auto mb-4 space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className="bg-primary-500/10 p-4 rounded-xl border-l-4 border-primary-500 animate-message-slide"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-semibold text-primary-400 text-sm">
                {message.author}
              </div>
              <div className="text-xs text-slate-500">
                {formatTime(message.timestamp)}
              </div>
            </div>
            <div className="text-slate-200 leading-relaxed">{message.text}</div>
          </div>
        ))}

        {/* Indicateur de frappe */}
        {isTyping && (
          <div className="bg-slate-700/50 p-3 rounded-xl border-l-4 border-slate-500 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-slate-400 text-sm">
                Quelqu'un est en train d'écrire...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Zone de saisie */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="w-full p-4 glass-effect rounded-2xl text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
            disabled={!isConnected}
          />
          {newMessage.length > 0 && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-slate-400">
              {newMessage.length}/500
            </div>
          )}
        </div>
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim() || !isConnected}
          className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <span className="hidden sm:inline">Envoyer</span>
          <span className="sm:hidden">📤</span>
        </button>
      </div>

      {/* Conseils d'utilisation */}
      <div className="mt-4 p-4 glass-effect rounded-xl">
        <div className="text-sm text-slate-400 text-center">
          💡 <strong>Conseil:</strong> Appuyez sur{" "}
          <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Entrée</kbd>{" "}
          pour envoyer votre message
        </div>
      </div>
    </div>
  );
}

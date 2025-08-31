import { useState, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Test de connexion à la base de données
    fetch("/api/test-db")
      .then((res) => res.json())
      .then((data) => {
        console.log("Test DB:", data);
      })
      .catch((err) => console.error("Erreur DB:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && username.trim()) {
      const newMessage = {
        id: Date.now(),
        username,
        content: message,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  const handleConnect = () => {
    if (username.trim()) {
      setIsConnected(true);
    }
  };

  return (
    <>
      <Head>
        <title>App Collaborative - Chat en Temps Réel</title>
        <meta
          name="description"
          content="Application collaborative avec chat temps réel"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🚀 App Collaborative
            </h1>
            <p className="text-gray-600">
              Chat en temps réel avec Next.js, Socket.IO et PostgreSQL
            </p>
          </header>

          {/* Connexion */}
          {!isConnected ? (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Se connecter</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Votre nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleConnect()}
                />
                <button
                  onClick={handleConnect}
                  className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Rejoindre le chat
                </button>
              </div>
            </div>
          ) : (
            /* Interface Chat */
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Zone des messages */}
                <div className="h-96 overflow-y-auto p-4 border-b">
                  <div className="space-y-3">
                    {messages.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        Aucun message. Soyez le premier à écrire ! 👋
                      </p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className="flex items-start space-x-3"
                        >
                          <div className="bg-blue-100 rounded-full p-2 text-sm font-semibold text-blue-600">
                            {msg.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-gray-800">
                                {msg.username}
                              </span>
                              <span className="text-xs text-gray-500">
                                {msg.timestamp}
                              </span>
                            </div>
                            <p className="text-gray-700">{msg.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Zone de saisie */}
                <form onSubmit={handleSubmit} className="p-4">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Tapez votre message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Envoyer
                    </button>
                  </div>
                </form>

                {/* Utilisateur connecté */}
                <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600">
                  Connecté en tant que:{" "}
                  <span className="font-semibold">{username}</span>
                  <button
                    onClick={() => setIsConnected(false)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Informations techniques */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">Temps Réel</h3>
              <p className="text-sm text-gray-600">
                Socket.IO pour la communication instantanée
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-3xl mb-3">🗄️</div>
              <h3 className="font-semibold mb-2">PostgreSQL</h3>
              <p className="text-sm text-gray-600">
                Base de données robuste et performante
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold mb-2">Next.js</h3>
              <p className="text-sm text-gray-600">
                Framework React moderne et optimisé
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// pages/api/test-db.js
export default function handler(req, res) {
  if (req.method === "GET") {
    // Pour l'instant, on retourne juste un message de test
    res.status(200).json({
      success: true,
      message: "API fonctionne",
      timestamp: new Date().toISOString(),
    });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

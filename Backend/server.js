const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const taskRoutes = require("./routes/taskRoutes"); // Import des routes

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques du dossier Frontend
app.use(express.static(path.join(__dirname, "../Frontend")));

// Connexion à MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((error) => {
    console.error("Erreur de connexion à MongoDB :", error);
    process.exit(1); // Arrête le serveur si la connexion échoue
  });

// Routes API
app.use("/tasks", taskRoutes); // Utilisation des routes pour les tâches

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

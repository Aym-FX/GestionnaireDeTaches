const mongoose = require("mongoose");
const Task = require("./models/Task");
const data = require("./data.json");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connexion à MongoDB réussie");
    await Task.deleteMany(); // Supprime toutes les tâches existantes
    await Task.insertMany(data); // Insère les données depuis data.json
    console.log("Données importées avec succès");
    process.exit();
  })
  .catch((error) => {
    console.error("Erreur lors de l'importation des données :", error);
    process.exit(1);
  });

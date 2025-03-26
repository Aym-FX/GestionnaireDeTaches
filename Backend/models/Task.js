const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now },
  echeance: { type: Date, required: true },
  statut: {
    type: String,
    enum: ["à faire", "en cours", "terminée", "annulée"],
    default: "à faire",
  },
  priorite: {
    type: String,
    enum: ["basse", "moyenne", "haute", "critique"],
    default: "moyenne",
  },
  auteur: {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true },
  },
  categorie: {
    type: String,
    enum: ["perso", "travail", "projet", "autre"],
    default: "autre",
  },
  etiquettes: [String],
  commentaires: [
    {
      auteur: { type: String, required: true },
      contenu: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Task", taskSchema);

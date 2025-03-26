const express = require("express");
const router = express.Router();
const Task = require("../models/Task"); // Assurez-vous que le modèle Task est correctement défini

// GET /tasks : Récupérer toutes les tâches
router.get("/", async (req, res) => {
  try {
    console.log("Requête reçue sur /tasks");
    const tasks = await Task.find();
    console.log("Tâches récupérées :", tasks);
    res.json(tasks);
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des tâches", error });
  }
});

// GET /tasks/:id : Récupérer une tâche par son identifiant
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.json(task);
  } catch (error) {
    console.error("Erreur lors de la récupération de la tâche :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la tâche", error });
  }
});

// POST /tasks : Créer une nouvelle tâche
router.post("/", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Erreur lors de la création de la tâche :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la tâche", error });
  }
});

// POST /tasks/:id/comment : Ajouter un commentaire à une tâche
router.post("/:id/comment", async (req, res) => {
  try {
    const { auteur, contenu } = req.body;

    if (!auteur || !contenu) {
      return res.status(400).json({ message: "Auteur et contenu requis" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // Ajouter le commentaire
    task.commentaires.push({ auteur, contenu });
    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du commentaire", error });
  }
});

// PUT /tasks/:id : Modifier une tâche existante
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la tâche", error });
  }
});

// DELETE /tasks/:id : Supprimer une tâche
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la tâche", error });
  }
});

module.exports = router;

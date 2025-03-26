document.addEventListener("DOMContentLoaded", async () => {
  const taskDetailsContainer = document.getElementById("task-details");
  const backBtn = document.getElementById("back-btn");
  const taskForm = document.getElementById("task-form");
  const sousTachesContainer = document.getElementById("sous-taches-container");
  const addSousTacheBtn = document.getElementById("add-sous-tache-btn");

  let sousTaches = []; // Stocker les sous-tâches localement

  // Récupérer l'ID de la tâche depuis l'URL
  const params = new URLSearchParams(window.location.search);
  const taskId = params.get("id");

  if (!taskId) {
    taskDetailsContainer.innerHTML =
      "<p>Erreur : Aucun ID de tâche fourni.</p>";
    return;
  }

  // Charger les détails de la tâche
  async function loadTaskDetails() {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const task = await response.json();

      // Afficher les détails de la tâche dans des champs modifiables
      taskDetailsContainer.innerHTML = `
        <label><strong>Titre :</strong>
          <input type="text" id="titre" value="${task.titre}" required />
        </label>
        <label><strong>Description :</strong>
          <textarea id="description" required>${task.description}</textarea>
        </label>
        <label><strong>Date de création :</strong>
          <input type="date" id="dateCreation" value="${
            new Date(task.dateCreation).toISOString().split("T")[0]
          }" disabled />
        </label>
        <label><strong>Échéance :</strong>
          <input type="date" id="echeance" value="${
            new Date(task.echeance).toISOString().split("T")[0]
          }" required />
        </label>
        <label><strong>Statut :</strong>
          <select id="statut">
            <option value="à faire" ${
              task.statut === "à faire" ? "selected" : ""
            }>À faire</option>
            <option value="en cours" ${
              task.statut === "en cours" ? "selected" : ""
            }>En cours</option>
            <option value="terminée" ${
              task.statut === "terminée" ? "selected" : ""
            }>Terminée</option>
            <option value="annulée" ${
              task.statut === "annulée" ? "selected" : ""
            }>Annulée</option>
          </select>
        </label>
        <label><strong>Priorité :</strong>
          <select id="priorite">
            <option value="basse" ${
              task.priorite === "basse" ? "selected" : ""
            }>Basse</option>
            <option value="moyenne" ${
              task.priorite === "moyenne" ? "selected" : ""
            }>Moyenne</option>
            <option value="haute" ${
              task.priorite === "haute" ? "selected" : ""
            }>Haute</option>
            <option value="critique" ${
              task.priorite === "critique" ? "selected" : ""
            }>Critique</option>
          </select>
        </label>
        <label><strong>Auteur :</strong>
          <input type="text" id="auteurNom" value="${
            task.auteur.nom
          }" required />
          <input type="text" id="auteurPrenom" value="${
            task.auteur.prenom
          }" required />
          <input type="email" id="auteurEmail" value="${
            task.auteur.email
          }" required />
        </label>
        <label><strong>Catégorie :</strong>
          <input type="text" id="categorie" value="${
            task.categorie
          }" required />
        </label>
        <label><strong>Étiquettes :</strong>
          <input type="text" id="etiquettes" value="${
            task.etiquettes ? task.etiquettes.join(", ") : ""
          }" />
        </label>
      `;

      // Charger les sous-tâches
      sousTaches = task.sousTaches || [];
      renderSousTaches();
    } catch (error) {
      console.error("Erreur lors du chargement de la tâche :", error);
      taskDetailsContainer.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
    }
  }

  // Fonction pour afficher les sous-tâches
  function renderSousTaches() {
    sousTachesContainer.innerHTML = sousTaches
      .map(
        (sousTache, index) => `
        <div class="sous-tache" data-index="${index}">
          <input type="text" class="sous-tache-titre" value="${
            sousTache.titre
          }" placeholder="Titre" required />
          <select class="sous-tache-statut">
            <option value="à faire" ${
              sousTache.statut === "à faire" ? "selected" : ""
            }>À faire</option>
            <option value="en cours" ${
              sousTache.statut === "en cours" ? "selected" : ""
            }>En cours</option>
            <option value="terminée" ${
              sousTache.statut === "terminée" ? "selected" : ""
            }>Terminée</option>
          </select>
          <input type="date" class="sous-tache-echeance" value="${
            sousTache.echeance
              ? new Date(sousTache.echeance).toISOString().split("T")[0]
              : ""
          }" />
          <button type="button" class="delete-sous-tache-btn">Supprimer</button>
        </div>
      `
      )
      .join("");

    // Attacher les événements pour supprimer une sous-tâche
    document.querySelectorAll(".delete-sous-tache-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.closest(".sous-tache").dataset.index;
        sousTaches.splice(index, 1);
        renderSousTaches();
      });
    });
  }

  // Ajouter une nouvelle sous-tâche
  addSousTacheBtn.addEventListener("click", () => {
    // Créer une nouvelle sous-tâche
    const newSousTache = document.createElement("div");
    newSousTache.className = "sous-tache";
    newSousTache.innerHTML = `
      <input type="text" class="sous-tache-titre" placeholder="Titre" required />
      <select class="sous-tache-statut">
        <option value="à faire" selected>À faire</option>
        <option value="en cours">En cours</option>
        <option value="terminée">Terminée</option>
      </select>
      <input type="date" class="sous-tache-echeance" />
      <button type="button" class="delete-sous-tache-btn">Supprimer</button>
    `;

    // Ajouter la sous-tâche au conteneur
    sousTachesContainer.appendChild(newSousTache);

    // Attacher l'événement de suppression
    newSousTache
      .querySelector(".delete-sous-tache-btn")
      .addEventListener("click", () => {
        sousTachesContainer.removeChild(newSousTache);
      });
  });

  // Fonction pour enregistrer les modifications
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedTask = {
      titre: document.getElementById("titre").value,
      description: document.getElementById("description").value,
      echeance: document.getElementById("echeance").value,
      statut: document.getElementById("statut").value,
      priorite: document.getElementById("priorite").value,
      auteur: {
        nom: document.getElementById("auteurNom").value,
        prenom: document.getElementById("auteurPrenom").value,
        email: document.getElementById("auteurEmail").value,
      },
      categorie: document.getElementById("categorie").value,
      etiquettes: document.getElementById("etiquettes").value.split(",").map(tag => tag.trim()),
      sousTaches: Array.from(document.querySelectorAll(".sous-tache")).map(sousTache => ({
        titre: sousTache.querySelector(".sous-tache-titre").value,
        statut: sousTache.querySelector(".sous-tache-statut").value,
        echeance: sousTache.querySelector(".sous-tache-echeance").value
      }))
    };

    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la tâche");
      }

      alert("Tâche mise à jour avec succès !");
      window.location.href = "/Views/index.html";
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
      alert("Erreur lors de la mise à jour de la tâche.");
    }
  });

  // Charger les détails de la tâche au démarrage
  loadTaskDetails();

  // Bouton retour
  backBtn.addEventListener("click", () => {
    window.location.href = "/Views/index.html";
  });
});

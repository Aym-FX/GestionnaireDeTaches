document.addEventListener("DOMContentLoaded", async () => {
  const tasksContainer = document.getElementById("tasks-container");
  const taskForm = document.getElementById("task-form");
  const taskCreationSection = document.getElementById("task-creation");
  const toggleFormBtn = document.getElementById("toggle-form-btn");
  let tasks = []; // Stocker les tâches récupérées
  let sortOrder = {}; // Stocker l'ordre de tri pour chaque colonne

  // Fonction pour afficher/masquer le formulaire
  toggleFormBtn.addEventListener("click", () => {
    if (taskCreationSection.style.display === "none") {
      taskCreationSection.style.display = "block";
      toggleFormBtn.textContent = "Masquer le formulaire";
    } else {
      taskCreationSection.style.display = "none";
      toggleFormBtn.textContent = "Créer une nouvelle tâche";
    }
  });

  // Fonction pour charger les tâches
  async function loadTasks() {
    try {
      console.log("Chargement des tâches...");
      const response = await fetch("http://localhost:3000/tasks");

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      tasks = await response.json();
      console.log("Tâches récupérées :", tasks);

      if (tasks.length === 0) {
        tasksContainer.innerHTML = "<p>Aucune tâche trouvée.</p>";
        return;
      }

      renderTasks(tasks);
    } catch (error) {
      console.error("Erreur lors du chargement des tâches :", error);
      tasksContainer.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
    }
  }

  // Fonction pour afficher les tâches
  function renderTasks(tasks) {
    tasksContainer.innerHTML = `
      <table class="tasks-table">
        <thead>
          <tr>
            <th data-column="titre">Titre</th>
            <th data-column="description">Description</th>
            <th data-column="dateCreation">Date de création</th>
            <th data-column="echeance">Échéance</th>
            <th data-column="statut">Statut</th>
            <th data-column="priorite">Priorité</th>
            <th data-column="auteur">Auteur</th>
            <th data-column="categorie">Catégorie</th>
            <th data-column="etiquettes">Étiquettes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${tasks
            .map(
              (task) => `
                <tr class="task-row" data-id="${task._id}">
                  <td>${task.titre}</td>
                  <td>${task.description}</td>
                  <td>${new Date(task.dateCreation).toLocaleDateString()}</td>
                  <td>${new Date(task.echeance).toLocaleDateString()}</td>
                  <td>${task.statut}</td>
                  <td class="priority-${task.priorite.toLowerCase()}">${
                task.priorite
              }</td>
                  <td>${task.auteur.nom} ${task.auteur.prenom}</td>
                  <td>${task.categorie}</td>
                  <td>${
                    task.etiquettes && task.etiquettes.length > 0
                      ? task.etiquettes.join(", ")
                      : "Aucune"
                  }</td>
                  <td>
                    <button class="edit-task" data-id="${
                      task._id
                    }">Modifier</button>
                    <button class="delete-task" data-id="${
                      task._id
                    }">Supprimer</button>
                  </td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;

    // Rendre les lignes cliquables
    document.querySelectorAll(".task-row").forEach((row) => {
      row.addEventListener("click", (e) => {
        const taskId = e.currentTarget.dataset.id;
        viewTaskDetails(taskId);
      });
    });

    // Attacher les événements "Modifier"
    document.querySelectorAll(".edit-task").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation(); // Empêche le clic sur la ligne de rediriger
        const taskId = e.target.dataset.id;
        editTask(taskId);
      });
    });

    // Attacher les événements "Supprimer"
    document.querySelectorAll(".delete-task").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation(); // Empêche le clic sur la ligne de rediriger
        const taskId = e.target.dataset.id;
        deleteTask(taskId);
      });
    });

    // Attacher les événements de tri
    document
      .querySelectorAll(".tasks-table th[data-column]")
      .forEach((header) => {
        header.addEventListener("click", () => {
          const column = header.dataset.column;
          sortTasks(column);
        });
      });
  }

  // Fonction pour trier les tâches
  function sortTasks(column) {
    // Définir l'ordre de tri (ascendant ou descendant)
    if (!sortOrder[column]) {
      sortOrder[column] = "asc";
    } else {
      sortOrder[column] = sortOrder[column] === "asc" ? "desc" : "asc";
    }

    // Trier les tâches
    tasks.sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];

      // Gérer les champs spécifiques
      if (column === "dateCreation" || column === "echeance") {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      } else if (column === "auteur") {
        valueA = `${a.auteur.nom} ${a.auteur.prenom}`;
        valueB = `${b.auteur.nom} ${b.auteur.prenom}`;
      }

      if (valueA < valueB) return sortOrder[column] === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder[column] === "asc" ? 1 : -1;
      return 0;
    });

    // Réafficher les tâches triées
    renderTasks(tasks);
  }

  // Fonction pour afficher les détails d'une tâche
  function viewTaskDetails(id) {
    window.location.href = `/Views/details.html?id=${id}`;
  }

  // Fonction pour modifier une tâche
  function editTask(id) {
    window.location.href = `/Views/task.html?id=${id}`;
  }

  // Fonction pour supprimer une tâche
  async function deleteTask(id) {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la tâche");
      }

      loadTasks();
    } catch (error) {
      console.error(error);
    }
  }

  // Fonction pour créer une tâche
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newTask = {
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
      etiquettes: document
        .getElementById("etiquettes")
        .value.split(",")
        .map((tag) => tag.trim()),
      sousTaches: JSON.parse(
        document.getElementById("sousTaches").value || "[]"
      ),
    };

    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la tâche");
      }

      alert("Tâche créée avec succès !");
      taskForm.reset(); // Réinitialiser le formulaire
      loadTasks(); // Recharger les tâches
    } catch (error) {
      console.error("Erreur lors de la création de la tâche :", error);
      alert("Erreur lors de la création de la tâche.");
    }
  });

  // Charger les tâches au démarrage
  loadTasks();
});

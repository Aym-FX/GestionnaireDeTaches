document.addEventListener("DOMContentLoaded", async () => {
  const taskDetailsContainer = document.getElementById("task-details");
  const commentsList = document.getElementById("comments-list");
  const commentForm = document.getElementById("comment-form");
  const commentAuthor = document.getElementById("comment-author");
  const commentContent = document.getElementById("comment-content");
  const backBtn = document.getElementById("back-btn");

  // Gestion du bouton "Retour"
  backBtn.addEventListener("click", () => {
    window.location.href = "/Views/index.html";
  });

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

      // Afficher les détails de la tâche
      taskDetailsContainer.innerHTML = `
        <p><strong>Titre :</strong> ${task.titre}</p>
        <p><strong>Description :</strong> ${task.description}</p>
        <p><strong>Date de création :</strong> ${new Date(
          task.dateCreation
        ).toLocaleDateString()}</p>
        <p><strong>Échéance :</strong> ${new Date(
          task.echeance
        ).toLocaleDateString()}</p>
        <p><strong>Statut :</strong> ${task.statut}</p>
        <p><strong>Priorité :</strong> ${task.priorite}</p>
        <p><strong>Auteur :</strong> ${task.auteur.nom} ${
        task.auteur.prenom
      }</p>
        <p><strong>Catégorie :</strong> ${task.categorie}</p>
        <p><strong>Étiquettes :</strong> ${
          task.etiquettes && task.etiquettes.length > 0
            ? task.etiquettes.join(", ")
            : "Aucune"
        }</p>
        <h3>Sous-tâches :</h3>
        <ul>
          ${
            task.sousTaches && task.sousTaches.length > 0
              ? task.sousTaches
                  .map(
                    (sousTache) => `
              <li>
                <strong>${sousTache.titre}</strong> - ${
                      sousTache.statut
                    } (Échéance : ${
                      sousTache.echeance
                        ? new Date(sousTache.echeance).toLocaleDateString()
                        : "Non définie"
                    })
              </li>
            `
                  )
                  .join("")
              : "<li>Aucune sous-tâche</li>"
          }
        </ul>
      `;

      // Afficher les commentaires
      commentsList.innerHTML = task.commentaires
        .map(
          (comment) => `
          <li>
            <strong>${comment.auteur}</strong> (${new Date(
            comment.date
          ).toLocaleDateString()}): ${comment.contenu}
          </li>
        `
        )
        .join("");
    } catch (error) {
      console.error("Erreur lors du chargement de la tâche :", error);
      taskDetailsContainer.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
    }
  }

  // Ajouter un commentaire
  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newComment = {
      auteur: commentAuthor.value,
      contenu: commentContent.value,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/tasks/${taskId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newComment),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du commentaire");
      }

      commentAuthor.value = "";
      commentContent.value = "";
      loadTaskDetails(); // Recharger les détails de la tâche
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
      alert("Erreur lors de l'ajout du commentaire.");
    }
  });

  // Charger les détails de la tâche au démarrage
  loadTaskDetails();
});

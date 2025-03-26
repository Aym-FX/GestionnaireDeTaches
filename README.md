# Gestionnaire de Tâches - Aymeric Sudre B1

Bienvenue dans le gestionnaire de tâches, une application web permettant de créer, gérer et suivre vos tâches et sous-tâches.

## Prérequis

- Node.js et npm installés
- MongoDB en cours d'exécution

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/Aym-FX/GestionnaireDeTaches.git
   cd gestionnaire-de-taches
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement dans un fichier `.env` :
   ```
   MONGO_URI=your_mongodb_uri
   ```

4. Démarrez le serveur :
   ```bash
   npm start
   ```

## Documentation de l'API

### Endpoints

- **GET /tasks** : Récupère toutes les tâches avec options de filtrage et de tri.
- **GET /tasks/:id** : Récupère une tâche par son identifiant.
- **POST /tasks** : Crée une nouvelle tâche.
- **PUT /tasks/:id** : Met à jour une tâche existante, y compris ses sous-tâches.

### Exemple de Requête

```http
GET /tasks?statut=en%20cours&tri=dateCreation&ordre=asc
```

## Mode d'Emploi

1. **Créer une Tâche** : Utilisez le formulaire de création pour ajouter une nouvelle tâche. Remplissez les champs requis et soumettez le formulaire.

2. **Gérer les Tâches** : Consultez la liste des tâches, appliquez des filtres et triez les résultats selon vos besoins.

3. **Modifier une Tâche** : Cliquez sur une tâche pour voir ses détails et modifiez les informations, y compris les sous-tâches.

4. **Enregistrer les Modifications** : Après avoir modifié une tâche, cliquez sur "Enregistrer les modifications" pour mettre à jour la base de données.

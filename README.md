Netflix Express
===================

# Installation

Placer les fichiers JSON dans le dossier `data/`. Les fichiers doivent être respectivement nommés `rated_titles.json` et `seen_titles.json`.

Lancer directement le serveur et créer la database:
```bash
npm run serverstart
```

_OU_

Commencer par créer la database et les modèles:
```bash
node_modules/.bin/sequelize db:migrate  # create the table in the database
```

L'arborescence de `data/` est maintenant la suivante:
```bash
data/
    database.sqlite3
    rated_titles.json
    seen_titles.json
```

Entrer les données des fichiers JSON dans la database.
```bash
node_modules/.bin/sequelize db:seed:all --debug  # fill database with JSON
```

Mettre à jour les entrées JSON modifiées (ajoûts d'entrées ou modification de date). Si aucune entrée du fichier JSON n'est déjà présente dans la database, les entrées de la database ayant l'attribut `type` du fichier JSON sont supprimées et le contenu du fichier JSON est inséré dans la database.
```bash
npm run populate
```

## Useful commands

```bash
node_modules/.bin/sequelize db:migrate:undo:all  # delete table (reset ID)
node_modules/.bin/sequelize db:seed:undo --seed "20200702122205-seed-title-rated.js"  # undo specific seed
```

 - [x] Parse JSON to Mongodb NoSQL database with `mongoose` (See the first commits),
 - [x] Parse JSON to Sqlite SQL database with `sequelize`,
 - [x] Connect the database and the server,
 - [x] Visualize the database,
 - [x] Add, remove and update entries,
 - [ ] Make some graphs,
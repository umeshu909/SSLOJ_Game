const sqlite3 = require('sqlite3').verbose();

// Remplacez ceci par le bon chemin vers votre base de données
const dbPath = '/Users/evann/Desktop/saintseiya-site/databases/DB_FR.sqlite';

// Création de la connexion à la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur d\'ouverture de la base de données:', err.message);
    return;
  }
  console.log('Connexion à la base de données réussie!');
});

// Effectuer une requête pour lister toutes les tables dans la base de données
db.all('SELECT name FROM sqlite_master WHERE type="table";', (err, rows) => {
  if (err) {
    console.error('Erreur lors de la récupération des tables:', err.message);
    db.close();
    return;
  }

  if (rows.length > 0) {
    console.log('Tables dans la base de données :');
    rows.forEach(row => console.log(row.name));
  } else {
    console.log('Aucune table trouvée.');
  }

  db.close((err) => {
    if (err) {
      console.error('Erreur lors de la fermeture de la base de données:', err.message);
      return;
    }
    console.log('Connexion à la base de données fermée.');
  });
});
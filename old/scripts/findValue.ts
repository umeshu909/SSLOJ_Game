import { openDb } from "@/utils/database";  // Importation de la fonction pour ouvrir la DB
import { NextApiRequest, NextApiResponse } from "next";

// Fonction pour afficher toutes les valeurs d'un personnage par ID
export async function findCharacterById(characterId: number) {
  const dbChoice = "FR";  // Choisir la base de données, ici en français par exemple

  try {
    // Connexion à la base de données
    const db = await openDb(dbChoice);

    // Construire une requête SQL avec plusieurs joints pour récupérer toutes les informations du personnage
    const sqlQuery = `
      SELECT 
        HeroConfig.id,
        HeroConfig.name,
        HeroConfig.firstname,
        HeroConfig.lastname,
        HeroConfig.hp,
        HeroConfig.atvalue AS ATK,
        HeroConfig.dfvalue AS DEF,
        HeroConfig.profession AS role,
        HeroConfig.party AS type,
        HeroConfig.herodesc AS description,
        HeroStoryConfig.describe AS story,
        HeroAwakeInfoConfig.propval1 AS awake_prop1,
        HeroAwakeInfoConfig.propval2 AS awake_prop2,
        HeroAwakeInfoConfig.propval3 AS awake_prop3,
        HeroAwakeInfoConfig.propval4 AS awake_prop4,
        HeroConfig.handbookherores AS image,
        HeroConfig.icon AS heroIcon
      FROM HeroConfig
      LEFT JOIN HeroStoryConfig ON HeroStoryConfig.id = HeroConfig.id
      LEFT JOIN HeroAwakeInfoConfig ON HeroAwakeInfoConfig.heroid = HeroConfig.id AND HeroAwakeInfoConfig.lv = 16
      WHERE HeroConfig.id = ?;
    `;

    // Exécuter la requête SQL pour récupérer les données du personnage
    const characterData = await db.get(sqlQuery, [characterId]);

    if (!characterData) {
      console.log(`Aucun personnage trouvé avec l'ID ${characterId}`);
      return;
    }

    // Afficher toutes les colonnes du personnage récupéré
    console.log("Données complètes du personnage:", characterData);

    // Exemple d'affichage des résultats de façon structurée
    console.log(`ID: ${characterData.id}`);
    console.log(`Nom: ${characterData.name}`);
    console.log(`Prénom: ${characterData.firstname}`);
    console.log(`Nom complet: ${characterData.firstname} ${characterData.lastname}`);
    console.log(`HP: ${characterData.hp}`);
    console.log(`ATK: ${characterData.ATK}`);
    console.log(`DEF: ${characterData.DEF}`);
    console.log(`Rôle: ${characterData.role}`);
    console.log(`Type: ${characterData.type}`);
    console.log(`Description: ${characterData.description}`);
    console.log(`Histoire: ${characterData.story}`);
    console.log(`Image: ${characterData.image}`);
    console.log(`Icone: ${characterData.heroIcon}`);
    console.log(`Éveil (prop1): ${characterData.awake_prop1}`);
    console.log(`Éveil (prop2): ${characterData.awake_prop2}`);
    console.log(`Éveil (prop3): ${characterData.awake_prop3}`);
    console.log(`Éveil (prop4): ${characterData.awake_prop4}`);
  } catch (error) {
    console.error("Erreur lors de la récupération des données du personnage:", error);
  }
}

// Appel de la fonction avec un ID de personnage spécifique (par exemple 13201)
findCharacterById(13201);
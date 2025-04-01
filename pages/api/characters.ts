import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { role, type, language, searchQuery, onlyAvailable, onlyAstraux } = req.query;  // Ajout de onlyAvailable
  const dbChoice = req.headers["x-db-choice"] || "FR";  // Choisir la base de données, par défaut "FR"

  try {
    const db = await openDb(dbChoice as string); // Connexion à la base de données

    // Initialisation des paramètres de la requête
    const queryParams: any[] = [];

    // Requête SQL modifiée
    let query = `
      SELECT HeroConfig.id, HeroConfig.name, HeroConfig.firstname, HeroConfig.tenheroroledrawing, 
             HeroConfig.profession, HeroConfig.party, HeroConfig.handbookherores
      FROM HeroConfig
      INNER JOIN HeroAwakeInfoConfig 
        ON HeroAwakeInfoConfig.heroid = HeroConfig.id 
        AND HeroAwakeInfoConfig.lv = 16
      WHERE HeroConfig.handbookimg != '' 
        AND HeroConfig.handbookimg IS NOT NULL 
        AND HeroConfig.initialstar = '5'
    `;

    // Si `onlyAvailable` est vrai, filtrer par isshow = 1
    if (onlyAvailable === 'true') {
      query += " AND HeroConfig.isshow = 1";  // Filtrer les personnages disponibles
    }

    // Si `onlyAAstraux` est vrai, filtrer par showtp = 7
    if (onlyAstraux === 'true') {
      query += " AND HeroConfig.showtp = 7";  // Filtrer les personnages Astraux
    }

    // Filtrer par searchQuery (nom commence par le texte)
    if (searchQuery) {
      query += " AND HeroConfig.name LIKE ?"; // Utilisation de LIKE pour une correspondance partielle
      queryParams.push(`${searchQuery}%`);
    }

    // Ajouter les conditions et paramètres de filtre si présents
    if (role) {
      const roles = Array.isArray(role) ? role : role.split(','); // gérer les multiples rôles
      query += " AND HeroConfig.profession IN (" + roles.map(() => "?").join(",") + ")";
      queryParams.push(...roles);
    }

    if (type) {
      const types = Array.isArray(type) ? type : type.split(','); // gérer les multiples types
      query += " AND HeroConfig.party IN (" + types.map(() => "?").join(",") + ")";
      queryParams.push(...types);
    }

    if (language) {
      query += " AND HeroConfig.language = ?"; // Filtrer par langue
      queryParams.push(language); // Ajouter le paramètre de langue
    }

    // Exécuter la requête SQL pour récupérer les personnages filtrés
    const characters = await db.all(query, queryParams);

    if (!characters || characters.length === 0) {
      return res.status(404).json({ error: "Aucun personnage trouvé" });
    }

    // Filtrer les personnages valides (en ajoutant une condition ici si nécessaire)
    const validCharacters = characters.filter((character: any) => character.id && character.name);

    // Éviter les doublons en utilisant un Set pour filtrer sur l'ID
    const uniqueCharacters = Array.from(new Set(validCharacters.map((character: any) => character.id)))
      .map(id => validCharacters.find((character: any) => character.id === id));

    // Formater les données des personnages
    const formattedCharacters = uniqueCharacters.map((character: any) => ({
      id: character.id,
      image: `/images/atlas/icon_tujian/${character.handbookherores}.png`, // Utilisation de "handbookherores" pour l'image
      name: character.name,
      role: character.profession,  // Utilisation de "profession" pour le rôle
      type: character.party,      // Utilisation de "party" pour le type
      description: character.herodesc, // Description ajoutée
      link: `/characters/${character.id}`, // Redirection vers la page du personnage
    }));

    res.status(200).json(formattedCharacters); // Renvoi des personnages formatés
  } catch (error) {
    console.error("Erreur lors de la récupération des personnages:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
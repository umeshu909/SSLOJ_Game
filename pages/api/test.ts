import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Récupère l'ID du personnage
  const dbChoice = req.headers["x-db-choice"] || "FR";  // Choisir la base de données, par défaut "FR"

  try {
    const db = await openDb(dbChoice as string); // Connexion à la base de données

    // Requête SQL pour récupérer toutes les données du personnage avec l'ID spécifié
    const query = "SELECT * FROM HeroConfig WHERE id = ?";
    const characterData = await db.get(query, [id]);

    if (!characterData) {
      return res.status(404).json({ error: "Personnage non trouvé" });
    }

    // Formater et envoyer les données
    res.status(200).json(characterData);
  } catch (error) {
    console.error("Erreur lors de la récupération des données du personnage:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
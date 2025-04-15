// pages/api/characters/[id]/constellations.ts
import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Récupérer l'ID du personnage depuis l'URL

  if (!id) {
    return res.status(400).json({ error: "ID du personnage manquant" });
  }

  const dbChoice = req.headers["x-db-choice"] || "FR";

  try {
    const db = await openDb(dbChoice as string);

    // Requête SQL pour récupérer les informations des constellations pour un personnage donné
    const sqlFilePath = path.join(process.cwd(), "sql", "getCharacterConstellations.sql");
    const query = fs.readFileSync(sqlFilePath, "utf-8");

    const constellationData = await db.all(query, [id]);

    if (!constellationData || constellationData.length === 0) {
      return res.status(404).json({ error: "Aucune constellation trouvée pour ce personnage" });
    }

    // Formatage des données des constellations avec plusieurs icônes par niveau de constellation (suitneed)
    const formattedData = {
      overname: constellationData[0].overname,
      icon: constellationData[0].iconConstellation,
      skills: constellationData.map((item) => ({
        skillName: item.nameSkillC3 || item.nameSkillC9,  // Choisir la compétence C3 ou C9 selon ce qui existe
        skillId: item.idSkillC3 || item.idSkillC9,  // Choisir la compétence C3 ou C9 selon ce qui existe
        level: item.levelSkillC3 || item.levelSkillC9,
        skillDescription: item.SkillC3 || item.SkillC9,  // Idem pour la description
        suitNeed: item.suitneed,
        icon: item.iconConstellation // Associer l'icône avec chaque niveau de constellation
      })),
    };

    // Nettoyer les chaînes de caractères dans l'objet data
    const cleanData = JSON.parse(JSON.stringify(formattedData, (key, value) => 
        typeof value === "string" ? value.replace(/\u00A0/g, " ") : value
    ));

    res.status(200).json(cleanData);
  } catch (error) {
    console.error("Erreur lors de la récupération des données de constellation:", error);
    res.status(500).json({ error: `Erreur interne du serveur: ${(error as Error).message}` });
  }
}
// pages/api/characters/[id]/constellations.ts
import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Récupérer l'ID du personnage depuis l'URL

  if (!id) {
    return res.status(400).json({ error: "ID du personnage manquant" });
  }

  const dbChoice = req.headers["x-db-choice"] || "FR";

  try {
    const db = await openDb(dbChoice as string);

    // Requête SQL pour récupérer les informations des constellations pour un personnage donné
    const query = `
      SELECT 
        ConstellationBaseConfig.overname,
        SkillConfigConstellations.icon as iconConstellation,
        ConstellationBaseConfig.suitneed,
        MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 3 THEN SkillTextConfigConstellations.name END) AS nameSkillC3,
        MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 3 THEN SkillTextConfigConstellations.desc END) AS SkillC3,
        MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 9 THEN SkillTextConfigConstellations.name END) AS nameSkillC9,
        MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 9 THEN SkillTextConfigConstellations.desc END) AS SkillC9
      FROM ConstellationBaseConfig
      LEFT JOIN SkillTextConfig AS SkillTextConfigConstellations ON SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid
      LEFT JOIN SkillConfig AS SkillConfigConstellations ON SkillConfigConstellations.skillid = SkillTextConfigConstellations.skillid AND SkillConfigConstellations.level = SkillTextConfigConstellations.level
      WHERE ConstellationBaseConfig.heroid = ?
      GROUP BY ConstellationBaseConfig.skillid, ConstellationBaseConfig.suitneed;
    `;
    const constellationData = await db.all(query, [id]);

    if (!constellationData || constellationData.length === 0) {
      return res.status(404).json({ error: "Aucune constellation trouvée pour ce personnage" });
    }

    // Formatage des données des constellations avec plusieurs icônes par niveau de constellation (suitneed)
    const formattedData = {
      overname: constellationData[0].overname,
      icon: constellationData[0].iconConstellation,
      skills: constellationData.map((item) => ({
        skillId: item.nameSkillC3 || item.nameSkillC9,  // Choisir la compétence C3 ou C9 selon ce qui existe
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
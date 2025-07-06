// pages/api/characters/[id]/constellationsDetails.ts
import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID constellation manquant" });
  }

  const dbChoice = req.headers["x-db-choice"] || "FR";

  try {
    const db = await openDb(dbChoice as string);

    // Chemin vers la requête SQL
    const sqlFilePath = path.join(process.cwd(), "sql", "getCharacterConstellationDetails.sql");
    const query = fs.readFileSync(sqlFilePath, "utf-8");

    const results = await db.all(query, [id]);

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Aucune constellation trouvée pour cette constellation" });
    }

    // Format des données pour l'affichage
    const formatted = results.map(row => ({
      id: row.id,
      name: row.name,
      quality: row.quality,
      icon: row.icon,
      props: [
        {
          id: row.prop1,
          name: row.ConstAttrib1,
          percent: row.percentConst1,
          base: row.value1,
          grow: row.growvalue1
        },
        {
          id: row.prop2,
          name: row.ConstAttrib2,
          percent: row.percentConst2,
          base: row.value2,
          grow: row.growvalue2
        },
        {
          id: row.prop3,
          name: row.ConstAttrib3,
          percent: row.percentConst3,
          base: row.value3,
          grow: row.growvalue3
        }
      ]
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Erreur lors de la récupération des constellations :", error);
    res.status(500).json({ error: `Erreur interne du serveur: ${(error as Error).message}` });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fisheryid, fishspecies, fishgrade } = req.query;
  const dbChoice = req.headers["x-db-choice"] || "FR";

  try {
    const db = await openDb(dbChoice as string);

    const sqlFilePath = path.join(process.cwd(), "sql", "getFishes.sql");
    let sqlQuery = fs.readFileSync(sqlFilePath, "utf-8");

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (fisheryid) {
      conditions.push("FishSpeciesConfig.fisheryid LIKE ?");
      params.push(`%${fisheryid}%`);
    }

    if (fishspecies) {
      conditions.push("FishSpeciesConfig.fishspecies = ?");
      params.push(fishspecies);
    }

    if (fishgrade) {
      conditions.push("FishSpeciesConfig.fishgrade = ?");
      params.push(fishgrade);
    }


    if (conditions.length > 0) {
      sqlQuery = sqlQuery.replace("-- {{CONDITIONS}}", "AND " + conditions.join(" AND "));
    } else {
      sqlQuery = sqlQuery.replace("-- {{CONDITIONS}}", "");
    }

    const data = await db.all(sqlQuery, params);

    if (!data) {
      return res.status(404).json({ error: "Aucun poisson trouvé" });
    }

    const cleanData = JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === "string" ? value.replace(/\u00A0/g, " ") : value
    ));

    res.status(200).json(cleanData);
  } catch (error) {
    console.error("Erreur lors de la récupération des poissons:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbChoice = req.headers["x-db-choice"] || "FR";

  try {
    const db = await openDb(dbChoice as string);

    const sqlFilePath = path.join(process.cwd(), "sql", "getPlanningRelicsBosses.sql");
    const sqlQuery = fs.readFileSync(sqlFilePath, "utf-8");

    const data = await db.all(sqlQuery);

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Aucun boss trouvé" });
    }

    // Nettoyage des données (remplace les caractères Unicode invisibles type espace insécable)
    const cleanData = JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === "string" ? value.replace(/\u00A0/g, " ") : value
    ));

    res.status(200).json(cleanData);
  } catch (error) {
    console.error("Erreur lors de la récupération des boss des reliques :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

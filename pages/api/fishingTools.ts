import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbChoice = req.headers["x-db-choice"] || "FR";  // "FR" par défaut

  try {
    const db = await openDb(dbChoice as string);

    // Charger la requête SQL depuis le fichier
    const sqlFilePath = path.join(process.cwd(), "sql", "getFishingTools.sql");
    const sqlQuery = fs.readFileSync(sqlFilePath, "utf-8");

    const data = await db.all(sqlQuery);

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Aucun outil de pêche trouvé." });
    }

    // Nettoyage des chaînes de caractères pour éviter les espaces insécables, etc.
    const cleanData = JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === "string" ? value.replace(/\u00A0/g, " ") : value
    ));

    res.status(200).json(cleanData);
  } catch (error) {
    console.error("Erreur lors de la récupération des outils de pêche:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

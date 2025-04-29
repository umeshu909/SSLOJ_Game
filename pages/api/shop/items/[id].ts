import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbChoice = req.headers["x-db-choice"] || "FR";
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID de shop invalide." });
  }

  try {
    const db = await openDb(dbChoice);

    // Charger la requête SQL avec remplacement manuel de :id
    const sqlFilePath = path.join(process.cwd(), "sql", "getShopItems.sql");
    const sqlQuery = fs.readFileSync(sqlFilePath, "utf-8");

   const currencyId = parseInt(id);
   const data = await db.all(sqlQuery, [currencyId, currencyId]);


    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Aucun item trouvé pour ce shop." });
    }

    const cleanData = JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === "string" ? value.replace(/\u00A0/g, " ") : value
    ));

    res.status(200).json(cleanData);
  } catch (error) {
    console.error("Erreur récupération des items du shop :", error);
    res.status(500).json({ error: "Erreur interne serveur" });
  }
}

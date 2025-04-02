import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { quality } = req.query;  
  const dbChoice = req.headers["x-db-choice"] || "FR";

  try {
    const db = await openDb(dbChoice as string);

    // Charger le fichier SQL principal (déjà enrichi avec les attributs)
    const mainSqlPath = path.join(process.cwd(), "sql", "getArayashikis.sql");
    let mainQuery = fs.readFileSync(mainSqlPath, "utf-8");

    // Adapter la requête si quality est vide
    if (!quality || quality === "") {
      mainQuery = mainQuery.replace("WHERE ep.level = ? AND", "WHERE");
    }

    const rows = quality ? await db.all(mainQuery, [quality]) : await db.all(mainQuery);

    if (!rows || !Array.isArray(rows)) {
      return res.status(404).json({ error: "cartes non trouvées" });
    }

    // Nettoyer les caractères spéciaux
    const cleanData = JSON.parse(JSON.stringify(rows, (key, value) =>
      typeof value === "string" ? value.replace(/\u00A0/g, " ") : value
    ));

    res.status(200).json(cleanData);
  } catch (error) {
    console.error("Erreur lors de la récupération des personnages:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
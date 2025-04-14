import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { quality } = req.query;
  const dbChoice = req.headers["x-db-choice"] || "FR";

  try {
    const db = await openDb(dbChoice as string);
    const baseSqlPath = path.join(process.cwd(), "sql", "getArayashikis.sql");
    let sql = fs.readFileSync(baseSqlPath, "utf-8");

    const params: any[] = [];

    if (quality) {
      sql += `\nWHERE ep.quality = ?`; // On filtre bien sur ep.quality ici
      params.push(Number(quality));
    }

    const data = await db.all(sql, params);

    if (!Array.isArray(data)) {
      return res.status(404).json({ error: "Cartes non trouvées" });
    }

    const cleanData = JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === "string" ? value.replace(/\u00A0/g, " ") : value
    ));

    res.status(200).json(cleanData);
  } catch (error) {
    console.error("Erreur lors de la récupération des personnages:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
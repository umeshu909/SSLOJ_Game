import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //const { quality } = req.query;  
    const dbChoice = req.headers["x-db-choice"] || "FR";  // Choisir la base de données, par défaut "FR"

    try {
      const db = await openDb(dbChoice as string);

      // Charger la requête depuis le fichier SQL
      const sqlFilePath = path.join(process.cwd(), "sql", "getStatues.sql");
      let sqlQuery = fs.readFileSync(sqlFilePath, "utf-8");

      // Adapter la requête si "quality" est absent
      /*if (!quality || quality === "") {
        sqlQuery = sqlQuery.replace("WHERE quality = ?", "");
      }

      const data = quality ? await db.all(sqlQuery, [quality]) : await db.all(sqlQuery);*/
      const data = await db.all(sqlQuery);

      if (!data) {
          return res.status(404).json({ error: "Statues non trouvés" });
      }

      // Nettoyer les chaînes de caractères dans l'objet data
      const cleanData = JSON.parse(JSON.stringify(data, (key, value) => 
          typeof value === "string" ? value.replace(/\u00A0/g, " ") : value
      ));

      res.status(200).json(cleanData); // Renvoi des personnages formatés
    } catch (error) {
      console.error("Erreur lors de la récupération des statues:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
}
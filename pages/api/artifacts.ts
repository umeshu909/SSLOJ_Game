import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { quality } = req.query;  
    const dbChoice = req.headers["x-db-choice"] || "FR";  // Choisir la base de données, par défaut "FR"

    try {
      const db = await openDb(dbChoice as string);

      // Charger la requête depuis le fichier SQL
      const sqlFilePath = path.join(process.cwd(), "sql", "getArtifacts.sql");
      let sqlQuery = fs.readFileSync(sqlFilePath, "utf-8");

      // Vérifie si la requête a déjà un WHERE
      //const hasWhere = /where/i.test(sqlQuery);

      // Ajoute AND ou WHERE selon le cas
      if (quality !== undefined && quality !== "") {
        sqlQuery += " AND quality = ?";
      }

      const qualityInt = parseInt(quality as string, 10);
      
      const data = quality !== undefined && quality !== ""
          ? await db.all(sqlQuery, [qualityInt])
          : await db.all(sqlQuery);

      if (!data) {
          return res.status(404).json({ error: "Artefacts non trouvés" });
      }

      // Nettoyer les chaînes de caractères dans l'objet data
      const cleanData = JSON.parse(JSON.stringify(data, (key, value) => 
          typeof value === "string" ? value.replace(/\u00A0/g, " ") : value
      ));

      res.status(200).json(cleanData); // Renvoi des personnages formatés
    } catch (error) {
      console.error("Erreur lors de la récupération des artefacts:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
}
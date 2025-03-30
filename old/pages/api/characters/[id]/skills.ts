import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const dbChoice = req.headers["x-db-choice"] || "FR";  // Par défaut, utiliser "FR"

    try {
        const db = await openDb(dbChoice as string);

        // Charger la requête depuis le fichier SQL
        const sqlFilePath = path.join(process.cwd(), "sql", "getCharacterSkills.sql");
        const sqlQuery = fs.readFileSync(sqlFilePath, "utf-8");

        const data = await db.get(sqlQuery, [id]);

        if (!data) {
            return res.status(404).json({ error: "Skills non trouvés pour ce personnage" });
        }

        // Construire la structure JSON comme demandé
        /*const formattedData = {
            [data.id]: {
                "": data
            }
        };*/

        // Nettoyer les chaînes de caractères dans l'objet data
        const cleanData = JSON.parse(JSON.stringify(data, (key, value) => 
            typeof value === "string" ? value.replace(/\u00A0/g, " ") : value
        ));
        
        res.status(200).json(cleanData);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des skills" });
    }
}

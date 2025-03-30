import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const level = req.query.level ? parseInt(req.query.level as string, 10) : 1;  // Niveau par défaut à 1
    const dbChoice = req.headers["x-db-choice"] || "FR";  // Choisir la base de données, par défaut "FR"

    try {
        const db = await openDb(dbChoice as string);

        // Charger la requête depuis le fichier SQL
        const sqlFilePath = path.join(process.cwd(), "sql", "getArayashikiDetail.sql");
        const sqlQuery = fs.readFileSync(sqlFilePath, "utf-8");

        // Vérifier si l'ID est valide
        if (!id) {
            return res.status(400).json({ error: "ID requis" });
        }

        /*console.log("Requête SQL : ", sqlQuery);
        console.log("ID : ", id);
        console.log("Level : ", level);*/

        // Exécuter la requête avec les paramètres
        const data = await db.get(sqlQuery, [id, id, level]);

        if (!data) {
            return res.status(404).json({ error: "Détail de la carte non trouvé" });
        }

        // Nettoyer les chaînes de caractères dans l'objet data
        const cleanData = JSON.parse(JSON.stringify(data, (key, value) => 
            typeof value === "string" ? value.replace(/\u00A0/g, " ") : value
        ));

        res.status(200).json(cleanData); // Renvoi des personnages formatés
    } catch (error) {
        console.error("Erreur lors de la récupération des personnages:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
}

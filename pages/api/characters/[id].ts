import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const dbChoice = req.headers["x-db-choice"] || "FR";  // Par défaut, utiliser "FR"

    try {
        const db    = await openDb(dbChoice as string);
        const db2   = await openDb("common" as string);

        // Charger la requête depuis le fichier SQL
        const sqlFilePath   = path.join(process.cwd(), "sql", "getCharacterInfo.sql");
        const sqlFilePath2  = path.join(process.cwd(), "sql", "getCommonsInfos.sql");
        const sqlFilePath3  = path.join(process.cwd(), "sql", "getCharacterAbilities.sql");

        const sqlQuery  = fs.readFileSync(sqlFilePath, "utf-8");
        const sqlQuery2 = fs.readFileSync(sqlFilePath2, "utf-8");
        const sqlQuery3 = fs.readFileSync(sqlFilePath3, "utf-8");

        const data  = await db.get(sqlQuery, [id]);
        const data2 = await db2.get(sqlQuery2, [id]);
        const abilities = await db2.all(sqlQuery3, [id]);

        if (!data) {
            return res.status(404).json({ error: "Personnage non trouvé" });
        }

        const formatDate = (date: string) => date === "0000-00-00" ? "Not released" : date;

        // Construire la string d'aptitudes : "apt1, apt2, apt3"
        const abilitiesList = abilities
          .map((row: any) => row.name) // utilisez le champ réel retourné, par ex. ability_name
          .join(", ");



        // Construire la structure JSON comme demandé
        const formattedData = {
            [data.id]: {
                "id": data.id,
                "image": [`/images/atlas/icon_tujian/${data.handbookherores}.png`],
                "image2": [`/images/atlas/lihui/${data.herodrawing}.png`],
                "name": data.name,
                "firstname": data.firstname,
                "rarity": "SSR",
                "element": data.Type,
                "role": data.Category,
                "release": data2 ? {
                    "Invocation": data2.Type !== '' ? data2.Type : '',
                    "Date": dbChoice === 'JP' ? formatDate(data2.datejp) : dbChoice === 'CN' ? formatDate(data2.datecn) : formatDate(data2.datefr)
                } : null,
                "stats": {
                    "Stars": "16★",
                    "Level": 240,
                    "PV": data.HP,
                    "ATQ": data.ATK,
                    "DÉF": data.DEF,
                    "Vitesse ATQ": `${data.VitesseAttaque}%`,
                    "Taux Crit.": `${data.TauxCrit}%`,
                    "Taux Tenacité": `${data.Tenacite}%`,
                    "Gain Cosmos ATK": `${data.angerattack}`,
                    "Gain Cosmos DMG": `${data.angerbeattack}`
                }, "abilities": abilitiesList, // Ajout de la liste d'aptitudes

            }
        };

        res.status(200).json(formattedData);
    } catch (error) {
        console.error("Erreur lors de la récupération du personnage:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
}

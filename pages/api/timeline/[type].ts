import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { type } = req.query;
    const dbChoice = "common";
    const dbChoice2 = "CN";
    const dbChoice3 = "FR";

    try {
        const db = await openDb(dbChoice);    // base releases
        const db2 = await openDb(dbChoice2);  // base CN
        const db3 = await openDb(dbChoice3);  // base FR

        let query = "";

        switch (type) {
            case "GLO":
                query = `SELECT datefr AS date, id, 'GLO' AS version, Type AS type FROM releases WHERE datefr IS NOT NULL AND datefr <> '0000-00-00' AND datefr > '2022-07-12' ORDER BY date DESC`;
                break;
            case "CN":
                query = `SELECT datecn AS date, id, 'CN' AS version, Type AS type FROM releases WHERE datecn IS NOT NULL AND datecn <> '0000-00-00' AND datecn > '2021-02-04' ORDER BY date DESC`;
                break;
            case "JP":
                query = `SELECT datejp AS date, id, 'JP' AS version, Type AS type FROM releases WHERE datejp IS NOT NULL AND datejp <> '0000-00-00' AND datejp > '2024-01-17' ORDER BY date DESC`;
                break;
            case "ALL":
            default:
                query = `
                    SELECT datefr AS date, id, 'GLO' AS version, Type AS type FROM releases WHERE datefr IS NOT NULL AND datefr <> '0000-00-00' AND datefr > '2022-07-12'
                    UNION ALL
                    SELECT datecn AS date, id, 'CN' AS version, Type AS type FROM releases WHERE datecn IS NOT NULL AND datecn <> '0000-00-00' AND datecn > '2021-02-04'
                    UNION ALL
                    SELECT datejp AS date, id, 'JP' AS version, Type AS type FROM releases WHERE datejp IS NOT NULL AND datejp <> '0000-00-00' AND datejp > '2024-01-17'
                    ORDER BY date DESC
                `;
                break;
        }

        const rawData = await db.all(query);
        if (!rawData || rawData.length === 0) {
            return res.status(404).json({ error: "Timeline non trouvée" });
        }

        // Enrichissement de chaque entrée
        const enrichedData = await Promise.all(
            rawData.map(async (item) => {
                // 1. Requête sur la base CN
                const cnRow = await db2.get(
                    `SELECT icon, name, firstname, lastname FROM HeroConfig WHERE id = ?`,
                    [item.id]
                );

                // 2. Requête sur la base FR (prioritaire pour nom)
                const frRow = await db3.get(
                    `SELECT name, firstname, lastname FROM HeroConfig WHERE id = ?`,
                    [item.id]
                );

                return {
                    ...item,
                    icon: cnRow?.icon || null,
                    name: frRow?.name ?? cnRow?.name ?? null,
                    firstname: frRow?.firstname ?? cnRow?.firstname ?? null,
                    lastname: frRow?.lastname ?? cnRow?.lastname ?? null,
                };
            })
        );

        res.status(200).json(enrichedData);
    } catch (error) {
        console.error("Erreur lors de la récupération de la timeline:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
}

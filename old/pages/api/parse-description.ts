import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    const { desc, dbChoice = "FR" } = req.body;

    if (!desc) {
        return res.status(400).json({ error: "Champ 'desc' requis" });
    }

    try {
        let parsed = desc;

        // Coloration des % et crochets
        parsed = parsed.replace(/(\d+([.,]\d+)?[\s\u00A0]*%)/g, '<span style="color: lightgreen;">$1</span>');
        parsed = parsed.replace(/\[(.*?)\]/g, '<span style="color: orange;">[$1]</span>');

        const matches = [...parsed.matchAll(/#(\d+)-(\d+)#/g)];
        if (matches.length === 0) {
            return res.status(200).json({ parsed });
        }

        const db = await openDb(dbChoice);

        for (const match of matches) {
            const [placeholder, id, idx] = match;
            const result = await db.get(
                "SELECT statetype, constval, atkadd FROM SkillValueConfig WHERE id = ? AND idx = ?",
                [parseInt(id), parseInt(idx)]
            );

            if (result) {
                const { statetype, constval, atkadd } = result;
                const total = Number(constval || 0) + Number(atkadd || 0);
                let formatted = "";
                if (statetype === 1) {
                    formatted = `<span style=\"color: lightgreen;\">${(total).toFixed(0)}</span>`;
                } else if (statetype === 3) {
                    formatted = `<span style=\"color: lightgreen;\">${(total / 1000).toFixed(0)}</span>`;
                } else if (statetype === 4) {
                    formatted = `<span style=\"color: lightgreen;\">${(total * 100)}%</span>`;
                } else {
                    formatted = `<span style=\"color: lightgreen;\">${total.toFixed(0)}%</span>`;
                }


                parsed = parsed.replace(placeholder, formatted);
            }

        }

        return res.status(200).json({ parsed });
    } catch (error) {
        console.error("Erreur dans le parsing:", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}

import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";

// Nettoyage visuel des nombres
const clean = (val: number) =>
  Number.isInteger(val) ? val.toString() : val.toFixed(2).replace(/\.00$/, "");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { desc, dbChoice = "FR" } = req.body;

  if (!desc) {
    return res.status(400).json({ error: "Champ 'desc' requis" });
  }

  try {
    const db = await openDb(dbChoice);
    let parsed = desc;

    const matches = [...parsed.matchAll(/#(\d+)-(\d+)#/g)];
    const replacements: Record<string, string> = {};

    for (const [placeholder, id, idx] of matches) {
      const key = `${id}-${idx}`;
      if (replacements[key]) continue;

      try {
        const row = await db.get(
          `SELECT * FROM SkillValueConfig WHERE id = ? AND idx = ?`,
          [id, idx]
        );

        let formatted: string | null = null;

        if (row) {
          let valueToUse: number | null = null;
          const possibleValues = [
            row.constval,
            row.lvadd,
            row.atkadd,
            row.lvatkadd,
            row.addtype,
            row.petadd,
            row.padd,
            row.lvpadd,
            row.madd,
            row.lvmadd,
          ];

          for (const value of possibleValues) {
            if (value && value > 0) {
              valueToUse = value;
              break;
            }
          }

          if (valueToUse !== null) {
            if (row.tp === 1) {
              if (row.statetype === 4 || row.statetype === 2) {
                formatted = `<span style="color: #82B0D6;">${clean(valueToUse * 100)}%</span>`;
              } else if (row.statetype === 3 && row.constval) {
                formatted = `<span style="color: #82B0D6;">${clean(valueToUse / 1000)}</span>`;
              } else {
                formatted = `<span style="color: #82B0D6;">${clean(valueToUse)}</span>`;
              }
            } else if (row.tp === 2) {
              if (row.statetype === 2) {
                formatted = `<span style="color: #82B0D6;">${clean(valueToUse)}%</span>`;
              } else if (row.statetype === 3) {
                formatted = `<span style="color: #82B0D6;">${clean(valueToUse / 1000)}</span>`;
              } else {
                formatted = `<span style="color: #82B0D6;">${clean(valueToUse)}</span>`;
              }
            }
          } else {
            formatted = `<span style="color: #82B0D6;">vide</span>`;
          }

          replacements[key] = formatted || '';
        } else {
          replacements[key] = `<span style="color: #82B0D6;">données non trouvées</span>`;
        }
      } catch (err) {
        console.error(`Erreur pour ${key}:`, err);
        replacements[key] = `<span style="color: #82B0D6;">erreur</span>`;
      }
    }

    // Appliquer les remplacements dans le texte
    for (const key in replacements) {
      parsed = parsed.replaceAll(`#${key}#`, replacements[key]);
    }


    // Mise en forme supplémentaire (Dont mise en forme des nombres)
    /*parsed = parsed
      .replace(/(\d+([.,]\d+)?[\s\u00A0]*%)/g, '<span style="color: lightgreen;">$1</span>')
      .replace(/\[(.*?)\]/g, '<span style="color: orange;">[$1]</span>')
      .replace(/(\d+(?:[.,]\d+)?)(?=\s*(secondes?|seconde|sec|couches?|points?)([.,\s]|$))/gi, '<span style="color: #82B0D6;">$1</span>')*/


    return res.status(200).json({ parsed });
  } catch (error) {
    console.error("Erreur dans le parsing:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

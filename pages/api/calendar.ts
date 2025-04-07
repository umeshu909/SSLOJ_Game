import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";
import { addDays } from "date-fns";

const loadSql = (filename: string): string => {
  return fs.readFileSync(path.join(process.cwd(), "sql", filename), "utf-8");
};

const parseDate = (dateStr: string) => new Date(dateStr);
const addDaysStr = (dateStr: string, days: number) => addDays(new Date(dateStr), days).toISOString();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbChoice = req.headers["x-db-choice"] || "FR";
  const db = await openDb(dbChoice as string);

  const files = [
    { file: "getPlanningCombatDuel.sql", type: "duel", title: "Combat Duel" },
    { file: "getPlanningCompetition.sql", type: "competition", title: "Compétition de compétence" },
    { file: "getPlanningDreamland.sql", type: "dreamland", title: "Illusion du vide" },
    { file: "getPlanningGloryPointsTournament.sql", type: "glory", title: "Tournoi de Gloire" },
    { file: "GetPlanningGodsBattle.sql", type: "gods", title: "Champs de Bataille des Dieux" },
    { file: "getPlanningRelics.sql", type: "relics", title: "Reliques des Dieux" },
    { file: "getPlanningWorldArena.sql", type: "arena", title: "Arène Mondiale" }
  ];

  const finalEvents: any[] = [];

  const isValidDate = (d: any) => {
    return typeof d === 'string' && !isNaN(new Date(d).getTime());
  };


  for (const f of files) {
    const sql = loadSql(f.file);
    const rows = await db.all(sql);

    const typeColors: Record<string, string> = {
      duel: "#3b82f6",         // Bleu franc
      competition: "#10b981",  // Vert émeraude
      dreamland: "#eab308",    // Jaune foncé (meilleure lisibilité)
      glory: "#f43f5e",        // Framboise
      gods: "#8b5cf6",         // Violet saturé
      relics: "#ea580c",       // Orange plus sombre
      arena: "#0ea5e9",        // Cyan distinct de duel
    };



    // 💥 Traitement spécifique pour Relics (hors boucle générale)
    if (f.type === "relics") {
      for (const row of rows) {
        const startDate = row.start?.toString().split(" ")[0];
        if (!startDate) continue;

        const endDate = addDays(new Date(startDate), row.total_days).toISOString().split("T")[0];

        finalEvents.push({
          title: f.title,
          start: startDate,
          end: endDate,
          allDay: true,
          category: f.type,
          color: typeColors[f.type],
          extendedProps: {
            enrollday: `${row.enrollday} days`,
            stamina: `${row.stamina_days} days`,
            silence: `${row.silence_days} days`,
            total: `${row.total_days} days`,
            players: row.players
          }
        });
      }

      continue; // 🔒 IMPORTANT : empêche la suite du traitement générique
    }

    for (const row of rows) {
      let startDate: string;
      let endDate: string;

      if (!row.Start) continue;

      // Utilise la date brute (YYYY-MM-DD)
      startDate = row.Start.toString().split(' ')[0];

      // Cas spécial Dreamland : durée variable
      if (f.type === "dreamland") {
        const duration = parseInt(row.duration || "4");
        endDate = addDays(new Date(startDate), duration).toISOString().split("T")[0];
      } else {
        // Autres cas : soit End connu, soit fallback 14 jours
        endDate = row.End
          ? row.End.toString().split(' ')[0]
          : addDays(new Date(startDate), 14).toISOString().split("T")[0];
      }

      const event: any = {
        title: f.type === "dreamland" && row.Map ? `${f.title} - ${row.Map}` : f.title,
        start: startDate,
        end: endDate,
        allDay: true,
        category: f.type,
        color: typeColors[f.type],
        extendedProps: {}
      };

      if (f.type === "dreamland" || f.type === "gods") {
        event.extendedProps.buffs = [row.BuffText1, row.BuffText2, row.BuffText3].filter(Boolean);
      }

      if (f.type === "relics") {
        for (const row of rows) {
          const startDate = row.start?.toString().split(" ")[0];
          if (!startDate) continue;

          const endDate = addDays(new Date(startDate), row.total_days).toISOString().split("T")[0];

          finalEvents.push({
            title: f.title,
            start: startDate,
            end: endDate,
            allDay: true,
            category: f.type,
            extendedProps: {
              enrollday: `${row.enrollday} days`,
              stamina: `${row.stamina_days} days`,
              silence: `${row.silence_days} days`,
              total: `${row.total_days} days`,
              players: row.players
            }
          });
        }

        continue; // Skip la boucle principale pour ne pas doubler
      }



      finalEvents.push(event);
    }



  }

  res.status(200).json(finalEvents);
}

import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";
import { addDays } from "date-fns";

const loadSql = (filename: string): string => {
  return fs.readFileSync(path.join(process.cwd(), "sql", filename), "utf-8");
};

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

  const typeColors: Record<string, string> = {
    duel: "#3b82f6",
    competition: "#10b981",
    dreamland: "#eab308",
    glory: "#f43f5e",
    gods: "#8b5cf6",
    relics: "#ea580c",
    arena: "#0ea5e9",
  };

  for (const f of files) {
    const sql = loadSql(f.file);
    const rows = await db.all(sql);

    if (f.type === "relics") {
      for (const row of rows) {
        const startRaw = row.start?.toString();
        if (!startRaw) continue;

        const startDate = startRaw.replace(" ", "T");
        const startObj = new Date(startDate);

        // Phase 1 : Pré-inscription
        const preStart = new Date(startObj);
        const preEnd = addDays(preStart, row.enrollday);

        const preEvent = {
          title: `${f.title} - Pré-inscription`,
          start: preStart.toISOString(),
          end: preEnd.toISOString(),
          allDay: false,
          category: f.type,
          color: "#fb923c", // orange clair
          extendedProps: {
            phase: "enrollday",
            players: row.players
          }
        };

        // Phase 2 : Normale (stamina)
        const staminaEnd = addDays(preEnd, row.stamina_days);
        const staminaEvent = {
          title: `${f.title}`,
          start: preEnd.toISOString(),
          end: staminaEnd.toISOString(),
          allDay: false,
          category: f.type,
          color: "#ea580c", // orange standard
          extendedProps: {
            phase: "stamina",
            players: row.players
          }
        };

        // Phase 3 : Silence
        const silenceEnd = addDays(staminaEnd, row.silence_days);
        const silenceEvent = {
          title: `${f.title} - Silence`,
          start: staminaEnd.toISOString(),
          end: silenceEnd.toISOString(),
          allDay: false,
          category: f.type,
          color: "#c2410c", // orange foncé
          extendedProps: {
            phase: "silence",
            players: row.players
          }
        };

        finalEvents.push(preEvent, staminaEvent, silenceEvent);
      }

      continue; // Ne pas continuer dans la boucle générique
    }

    // Traitement générique
    for (const row of rows) {
      if (!row.Start) continue;

      let startDate = row.Start.toString().replace(' ', 'T');
      let endDate: string;

      if (f.type === "dreamland") {
        const duration = parseInt(row.duration || "4");
        const startObj = new Date(startDate);
        const endObj = addDays(startObj, duration);
        endDate = endObj.toISOString();
      } else {
        if (row.End) {
          endDate = row.End.toString().replace(' ', 'T');
        } else {
          const fallback = addDays(new Date(startDate), 14);
          endDate = fallback.toISOString();
        }
      }

      const event: any = {
        title: f.type === "dreamland" && row.Map ? `${f.title} - ${row.Map}` : f.title,
        start: startDate,
        end: endDate,
        allDay: false,
        category: f.type,
        color: typeColors[f.type],
        extendedProps: {}
      };

      if (f.type === "dreamland" || f.type === "gods") {
        event.extendedProps.buffs = [row.BuffText1, row.BuffText2, row.BuffText3].filter(Boolean);
      }

      finalEvents.push(event);
    }
  }

  res.status(200).json(finalEvents);
}

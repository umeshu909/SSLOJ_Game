import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { exec } from "child_process";

function parseDiffByTable(diff: string): Record<string, string[]> {
  const lines = diff.split(/\r?\n/);
  const result: Record<string, string[]> = {};

  for (const line of lines) {
    if (!line.trim()) continue;

    const match = line.match(/^(INSERT INTO|UPDATE|DELETE FROM)\s+["`]?(\w+)["`]?/i);
    if (match) {
      const table = match[2];
      if (!result[table]) result[table] = [];
      result[table].push(line);
    } else {
      // ligne de continuation (ex: multi-lignes de valeurs)
      const lastTable = Object.keys(result).at(-1);
      if (lastTable) {
        result[lastTable][result[lastTable].length - 1] += `\n${line}`;
      }
    }
  }

  return result;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbOld = path.join(process.cwd(), "databases", "DB_OLDFR.sqlite");
  const dbNew = path.join(process.cwd(), "databases", "DB_FR.sqlite");

  exec(`sqldiff "${dbOld}" "${dbNew}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("Erreur sqldiff :", error);
      res.status(500).json({ error: "Erreur sqldiff", details: stderr });
      return;
    }

    const structured = parseDiffByTable(stdout);
    res.status(200).json(structured);
  });
}

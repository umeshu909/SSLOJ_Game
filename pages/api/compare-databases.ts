import { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const openDb = async (file: string) => open({ filename: file, driver: sqlite3.Database });

const getTables = async (db: any) => {
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
  return tables.map(t => t.name);
};

// Définir les clés uniques connues pour certaines tables
const tableKeys: Record<string, string[]> = {
  SkillValueConfig: ["id", "idx"],
};

const normalize = (val: any) =>
  val === null || val === undefined ? null : String(val).replace(/\u00A0/g, " ").trim();

const rowKey = (row: any, keys: string[]) =>
  keys.map(k => normalize(row[k])).join("|---|");

const generateInsert = (table: string, row: any) => {
  const columns = Object.keys(row).map(k => `\`${k}\``).join(", ");
  const values = Object.values(row).map(v => (v === null ? "NULL" : `'${String(v).replace(/'/g, "''")}'`)).join(", ");
  return `INSERT INTO ${table} (${columns}) VALUES (${values});`;
};

const generateUpdate = (table: string, newRow: any, oldRow: any, keys: string[]) => {
  const sets: string[] = [];

  for (const k of Object.keys(newRow)) {
    const newVal = normalize(newRow[k]);
    const oldVal = normalize(oldRow[k]);
    if (newVal !== oldVal) {
      sets.push(`\`${k}\` = ${newVal === null ? "NULL" : `'${newVal.replace(/'/g, "''")}'`}`);
    }
  }
  if (sets.length === 0) return null;

  const where = keys.map(k => `\`${k}\` = '${String(newRow[k]).replace(/'/g, "''")}'`).join(" AND ");
  return `UPDATE ${table} SET ${sets.join(", ")} WHERE ${where};`;
};

const generateDelete = (table: string, row: any, keys: string[]) => {
  const where = keys.map(k => `\`${k}\` = '${String(row[k]).replace(/'/g, "''")}'`).join(" AND ");
  return `DELETE FROM ${table} WHERE ${where};`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db1Path = path.join(process.cwd(), "databases", "DB_FR.sqlite");
    const db2Path = path.join(process.cwd(), "databases", "DB_OLDFR.sqlite");

    const db1 = await openDb(db1Path);
    const db2 = await openDb(db2Path);

    const tables1 = await getTables(db1);
    const tables2 = await getTables(db2);
    const allTables = Array.from(new Set([...tables1, ...tables2]));

    const differences: Record<string, string[]> = {};

    for (const table of allTables) {
      const keys = tableKeys[table] || ["id"];
      const existsInDb1 = tables1.includes(table);
      const existsInDb2 = tables2.includes(table);

      const diffs: string[] = [];

      if (existsInDb1 && existsInDb2) {
        const rows1 = await db1.all(`SELECT * FROM \`${table}\``);
        const rows2 = await db2.all(`SELECT * FROM \`${table}\``);

        const index1 = new Map(rows1.map(r => [rowKey(r, keys), r]));
        const index2 = new Map(rows2.map(r => [rowKey(r, keys), r]));

        for (const [k, newRow] of index1.entries()) {
          if (!index2.has(k)) {
            diffs.push(generateInsert(table, newRow));
          } else {
            const oldRow = index2.get(k);
            const upd = generateUpdate(table, newRow, oldRow, keys);
            if (upd) diffs.push(upd);
          }
        }

        for (const [k, oldRow] of index2.entries()) {
          if (!index1.has(k)) {
            diffs.push(generateDelete(table, oldRow, keys));
          }
        }
      } else if (existsInDb1) {
        const rows = await db1.all(`SELECT * FROM \`${table}\``);
        for (const row of rows) {
          diffs.push(generateInsert(table, row));
        }
      } else if (existsInDb2) {
        const rows = await db2.all(`SELECT * FROM \`${table}\``);
        for (const row of rows) {
          diffs.push(generateDelete(table, row, keys));
        }
      }

      if (diffs.length > 0) {
        differences[table] = diffs;
      }
    }

    res.status(200).json(differences);
  } catch (err) {
    console.error("Erreur comparaison bases:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

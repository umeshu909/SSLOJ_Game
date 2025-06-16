import sqlite3 from 'sqlite3';
import fetch from 'node-fetch';
import { open } from 'sqlite';

const DB_PATH = '/SSLOJ_GAME/databases/DB_COMMON.sqlite';
const PATCH_URL = 'http://list.seiya-eur.wdyxgames.com:8082//getgg.php?ptid=2&language=fr';

function extractDateFromContent(content) {
  const match = content.match(/(\d{1,2})\/(\d{1,2})/);
  if (!match) return null;

  const day = match[1];
  const month = match[2];
  const year = new Date().getFullYear();

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

async function main() {
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });

  const res = await fetch(PATCH_URL);
  const json = await res.json();

  for (const entry of json) {
    const datePatch = extractDateFromContent(entry.content);
    if (!datePatch) continue;

    const existing = await db.get(
      `SELECT 1 FROM PatchNotes WHERE date_patch = ?`,
      [datePatch]
    );

    if (!existing) {
      try {
        await db.run(
          `INSERT INTO PatchNotes (ptid, type, level, title, content, language, date_patch)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [entry.ptid, entry.type, entry.level, entry.title, entry.content, entry.language, datePatch]
        );
        console.log(`✅ Patch note inséré pour ${datePatch}`);
      } catch (err) {
        console.error("❌ Erreur insertion patch note:", err);
      }
    } else {
      console.log(`⏩ Patch note déjà existant pour ${datePatch}, insertion ignorée.`);
    }
  }

  await db.close();
}

main();

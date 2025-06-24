import sqlite3 from 'sqlite3';
import fetch from 'node-fetch';
import { open } from 'sqlite';

const DB_PATH = '/home/ubuntu/SSLOJ_Game/databases/DB_COMMON.sqlite';

const LANGUAGES = [
  { code: 'fr', url: 'http://list.seiya-eur.wdyxgames.com:8082//getgg.php?ptid=2&language=fr' },
  { code: 'en', url: 'http://list.seiya-eur.wdyxgames.com:8082//getgg.php?ptid=2&language=en' },
  { code: 'es', url: 'http://list.seiya-eur.wdyxgames.com:8082//getgg.php?ptid=2&language=es' },
  { code: 'br', url: 'http://list.seiya-eur.wdyxgames.com:8082//getgg.php?ptid=2&language=pt' },
  { code: 'ita', url: 'http://list.seiya-eur.wdyxgames.com:8082//getgg.php?ptid=2&language=ita' },
  { code: 'jp', url: 'http://list.seiya-jp.wdyxgames.com:8082//getgg.php?ptid=2&language=ja' },
  { code: 'cn', url: 'http://list.seiya-tw.wdyxgames.com:8082/getgg.php?ptid=10001&language=cht' }
];

// Prend en charge les formats "18/6" ainsi que "6月25日"
function extractDateFromContent(content) {
  let match = content.match(/(\d{1,2})\/(\d{1,2})/);
  if (!match) {
    match = content.match(/(\d{1,2})月(\d{1,2})日/);
  }
  if (!match) return null;
  const day = match[2], month = match[1];
  const year = new Date().getFullYear();
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

async function main() {
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });

  for (const { code, url } of LANGUAGES) {
    let json;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      json = await res.json();
    } catch (err) {
      console.error(`[${code}] Erreur réseau/JSON:`, err.message);
      continue;
    }

    for (const entry of json) {
      const datePatch = extractDateFromContent(entry.content);
      if (!datePatch) {
        console.log(`⏩ Pas de date détectée pour une entrée (${code})`);
        continue;
      }

      const exists = await db.get(
        `SELECT 1 FROM PatchNotes WHERE date_patch = ? AND language = ?`,
        [datePatch, code]
      );

      if (!exists) {
        try {
          await db.run(
            `INSERT INTO PatchNotes (ptid, type, level, title, content, language, date_patch)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              entry.ptid ?? '',
              entry.type ?? '',
              entry.level ?? '',
              entry.title ?? '',
              entry.content ?? '',
              code,
              datePatch
            ]
          );
          console.log(`✅ Patch note inséré : ${datePatch} (${code})`);
        } catch (err) {
          console.error(`❌ Erreur insertion (${code}):`, err.message);
        }
      } else {
        console.log(`⏩ Déjà existant : ${datePatch} (${code})`);
      }
    }
  }

  await db.close();
}

main();

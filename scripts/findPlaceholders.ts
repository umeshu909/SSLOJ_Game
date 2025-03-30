import { openDb } from "@/utils/database";

async function main() {
  const db = await openDb("FR"); // Ou le nom de ta base, adapte si nécessaire

  const query = `
    SELECT skillid, level, name, desc 
    FROM SkillTextConfig 
    WHERE desc LIKE '%#%#'
  `;

  const rows = await db.all(query);
  console.log("Résultats trouvés :", rows.length);

  for (const row of rows) {
    console.log(`[${row.skillid} | Lvl ${row.level}] ${row.name}`);
    console.log(row.desc);
    console.log("----------");
  }
}

main().catch(console.error);
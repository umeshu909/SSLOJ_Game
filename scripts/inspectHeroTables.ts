import { openDb } from "@/utils/database";

async function inspectHeroTables() {
  const db = await openDb("FR");

  console.log("🔍 Inspection de la table HeroConfig");
  try {
    const heroConfigColumns = await db.all(`PRAGMA table_info(HeroConfig)`);
    console.log("→ Colonnes de HeroConfig:");
    heroConfigColumns.forEach((col) => {
      console.log(`  - ${col.name} (${col.type})`);
    });
  } catch (err) {
    console.error("Erreur lors de l'interrogation de HeroConfig:", err);
  }

  console.log("\n📋 Recherche des tables similaires à HeroInfoConfig...");
  try {
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    const heroRelated = tables
      .map((row) => row.name)
      .filter((name) => /hero.*info/i.test(name));

    if (heroRelated.length === 0) {
      console.log("⚠️ Aucune table correspondant à /hero.*info/i trouvée.");
    } else {
      for (const tableName of heroRelated) {
        console.log(`\n🧩 Table trouvée : ${tableName}`);
        try {
          const columns = await db.all(`PRAGMA table_info(${tableName})`);
          console.log("→ Colonnes:");
          columns.forEach((col) => {
            console.log(`  - ${col.name} (${col.type})`);
          });
        } catch (err) {
          console.error(`Erreur lors de l'interrogation de ${tableName}:`, err);
        }
      }
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des tables:", err);
  }
}

inspectHeroTables();
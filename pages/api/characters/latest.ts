import type { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const lang = (req.headers["x-db-choice"]?.toString() || "FR").toUpperCase();
  const dateField = lang === "JP" ? "datejp" : lang === "CN" ? "datecn" : "datefr";

  try {
    const db = await openDb(lang);
    const dbCommon = await openDb("common");

    // 1. Récupérer les personnages disponibles avec isshow = 1
    const availableHeroes = await db.all(`
      SELECT HeroConfig.id, HeroConfig.name, HeroConfig.profession AS role, HeroConfig.party AS type, HeroConfig.handbookherores AS icon
      FROM HeroConfig
      WHERE HeroConfig.isshow = 1
    `);

    if (!availableHeroes || availableHeroes.length === 0) {
      return res.status(404).json({ error: "Aucun personnage disponible trouvé." });
    }

    // 2. Pour chaque personnage, récupérer la date de sortie dans la table "releases"
    const heroesWithDates = await Promise.all(
      availableHeroes.map(async (hero: any) => {
        const commons = await dbCommon.get(
          `SELECT ${dateField} as releaseDate FROM releases WHERE id = ?`,
          [hero.id]
        );
        return {
          ...hero,
          releaseDate: commons?.releaseDate || null,
        };
      })
    );

    // 3. Filtrer les persos dont la date est définie et déjà passée
    const today = new Date().toISOString().split("T")[0];
    const releasedHeroes = heroesWithDates
      .filter((hero) => hero.releaseDate && hero.releaseDate <= today)
      .sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1));

    if (releasedHeroes.length === 0) {
      return res.status(404).json({ error: "Aucun personnage sorti trouvé." });
    }

    const latest = releasedHeroes[0];
    const link = `/characters/${latest.id}?dbChoice=${lang}&categId=stats`;

    // 4. Requête pour récupérer les stats principales au niveau 240
    const statsRow = await db.get(
      `
      SELECT 
        ROUND(HeroConfig.hp + ((HeroConfig.hpup + (HeroConfig.hpup * 10.2)) * (240 - 1)) + HeroAwakeInfoConfig.propval1 + (HeroAwakeInfoConfig.propval4 * (240 - 1))) AS hp,
        ROUND(HeroConfig.atvalue + ((HeroConfig.atvalueup + (HeroConfig.atvalueup * 10.2)) * (240 - 1)) + HeroAwakeInfoConfig.propval2 + (HeroAwakeInfoConfig.propval5 * (240 - 1))) AS atk,
        ROUND(HeroConfig.dfvalue + ((HeroConfig.dfvalueup + (HeroConfig.dfvalueup * 10.2)) * (240 - 1)) + HeroAwakeInfoConfig.propval3 + (HeroAwakeInfoConfig.propval6 * (240 - 1))) AS def,
        ROUND(HeroConfig.pcritlv / 10.0, 1) AS crit,
        ROUND(HeroConfig.rcritlv / 10.0, 1) AS tenacity,
        HeroConfig.hitrate * 100 AS speed
      FROM HeroConfig
      LEFT JOIN HeroAwakeInfoConfig ON HeroAwakeInfoConfig.heroid = HeroConfig.id AND HeroAwakeInfoConfig.lv = 16
      WHERE HeroConfig.id = ?
      `,
      [latest.id]
    );

    return res.status(200).json({
      id: latest.id,
      name: latest.name,
      role: latest.role,
      type: latest.type,
      image: `/images/atlas/icon_tujian/${latest.icon}.png`,
      releaseDate: latest.releaseDate,
      link,
      stats: {
        hp: statsRow?.hp || 0,
        atk: statsRow?.atk || 0,
        def: statsRow?.def || 0,
        crit: statsRow?.crit || 0,
        tenacity: statsRow?.tenacity || 0,
        speed: statsRow?.speed || 0,
      },
    });
  } catch (err) {
    console.error("Erreur dans /api/characters/latest :", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

function normalizeString(str: string): string {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { role, type, language, searchQuery, onlyAvailable, onlyAstraux, invocation } = req.query;
  const dbChoice = req.headers["x-db-choice"] || "FR";

  try {
    const db = await openDb(dbChoice as string);
    const dbCommon = await openDb("common"); // 👈 Ajout ouverture DB_COMMON

    const queryParams: any[] = [];

    let query = `
      SELECT HeroConfig.id, HeroConfig.name, HeroConfig.firstname, HeroConfig.tenheroroledrawing, 
             HeroConfig.profession, HeroConfig.party, HeroConfig.handbookherores
      FROM HeroConfig
      INNER JOIN HeroAwakeInfoConfig 
        ON HeroAwakeInfoConfig.heroid = HeroConfig.id 
        AND HeroAwakeInfoConfig.lv = 16
      WHERE HeroConfig.handbookimg != '' 
        AND HeroConfig.handbookimg IS NOT NULL 
        AND HeroConfig.initialstar = '5'
    `;

    if (onlyAvailable === 'true') {
      query += " AND HeroConfig.isshow = 1";
    }

    if (onlyAstraux === 'true') {
      query += " AND HeroConfig.showtp = 7";
    }

    if (role) {
      const roles = Array.isArray(role) ? role : role.split(',');
      query += " AND HeroConfig.profession IN (" + roles.map(() => "?").join(",") + ")";
      queryParams.push(...roles);
    }

    if (type) {
      const types = Array.isArray(type) ? type : type.split(',');
      query += " AND HeroConfig.party IN (" + types.map(() => "?").join(",") + ")";
      queryParams.push(...types);
    }

    if (language) {
      query += " AND HeroConfig.language = ?";
      queryParams.push(language);
    }

    const characters = await db.all(query, queryParams);

    if (!characters || characters.length === 0) {
      return res.status(200).json([]);
    }

    const normalizedSearch = searchQuery
      ? normalizeString(searchQuery as string)
      : null;

    const filteredCharacters = [];

    for (const character of characters) {
      if (!character.id || !character.name) continue;

      // Filtrage par recherche
      if (normalizedSearch && !normalizeString(character.name).includes(normalizedSearch)) {
        continue;
      }

      // 🔍 Récupération du type d'invocation
      const invocationInfo = await dbCommon.get(
        "SELECT Type FROM releases WHERE id = ?",
        [character.id]
      );
      const invocationType = invocationInfo?.Type || "";

      // Filtrage si paramètre invocation fourni
      if (invocation && invocationType !== invocation) {
        continue;
      }

      filteredCharacters.push({
        id: character.id,
        image: `/images/atlas/icon_tujian/${character.handbookherores}.png`,
        name: character.name,
        role: character.profession,
        type: character.party,
        description: character.herodesc,
        link: `/characters/${character.id}`,
        invocationType, // Tu peux l'utiliser pour affichage aussi
      });
    }

    res.status(200).json(filteredCharacters);
  } catch (error) {
    console.error("Erreur lors de la récupération des personnages:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

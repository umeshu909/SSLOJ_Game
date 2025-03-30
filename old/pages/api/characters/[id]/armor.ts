import { NextApiRequest, NextApiResponse } from "next";
import { openDb } from "@/utils/database";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, level } = req.query;
  const dbChoice = req.headers["x-db-choice"] || "FR";

  try {
    const db = await openDb(dbChoice as string);

    if (!id) {
      return res.status(400).json({ error: "ID du personnage manquant" });
    }

    const queryPath = path.join(process.cwd(), "sql", "getCharacterArmor.sql");
    const query = fs.readFileSync(queryPath, "utf-8");

    const armorData = await db.all(query, [id]);
    if (!armorData || armorData.length === 0) {
      return res.status(404).json({ error: "Aucune armure trouvée pour ce personnage" });
    }

    const levelNum = parseInt(level as string, 10);
    const useLevel = isNaN(levelNum) ? 30 : levelNum; // Niveau 30 par défaut

    // Fonction pour calculer les attributs
    const formatStat = (
      attribute: string,
      grownum: number,
      percent: boolean,
      level: number
    ) => {
      let rawValue = grownum * level;

      // Si l'attribut est un pourcentage, on applique le facteur de pourcentage
      if (percent) {
        rawValue *= 100;
      }

      const value = Math.round(rawValue);

      return {
        attribute,
        growth: grownum,
        percent,
        value,
        formattedValue: percent ? `${value}%` : value.toString(),
      };
    };

    // Calcul des statistiques pour le niveau 30
    const stats30 = [
      formatStat(armorData[0].ArmorAttrib1, armorData[0].grownum1, armorData[0].percentArmor1 === 1, 30),
      formatStat(armorData[0].ArmorAttrib2, armorData[0].grownum2, armorData[0].percentArmor2 === 1, 30),
      formatStat(armorData[0].ArmorAttrib3, armorData[0].grownum3, armorData[0].percentArmor3 === 1, 30),
      formatStat(armorData[0].ArmorAttrib4, armorData[0].grownum4, armorData[0].percentArmor4 === 1, 30),
    ];

    const stats40 = [
      formatStat(armorData[0].ArmorAttrib1, armorData[0].grownum1, armorData[0].percentArmor1 === 1, 40),
      formatStat(armorData[0].ArmorAttrib2, armorData[0].grownum2, armorData[0].percentArmor2 === 1, 40),
      formatStat(armorData[0].ArmorAttrib3, armorData[0].grownum3, armorData[0].percentArmor3 === 1, 40),
      formatStat(armorData[0].ArmorAttrib4, armorData[0].grownum4, armorData[0].percentArmor4 === 1, 40),
    ];

    // Récupère les infos du personnage pour déterminer si on doit afficher le switch
    const heroRow = await db.get(`SELECT party, showtp FROM HeroConfig WHERE id = ?`, [id]);
    const canSwitch = heroRow && (heroRow.party === 5 || heroRow.party === 6 || heroRow.showtp === 7);

    // Sélectionner les stats en fonction du niveau demandé
    const stats = useLevel === 40 ? stats40 : stats30;

    const armorIcon = armorData[0].icon?.replace(".png", "");

    const armor = {
      name: armorData[0].armor_name,
      overname: armorData[0].armor_overname,
      icon: armorIcon,
      image: armorIcon ? `/shengyilihui/${armorIcon}.png` : "/images/default-armor.png",
      stats,
      party: armorData[0].party,
      levelCap: armorData[0].armorType,
      level: useLevel,
      canSwitch,
      skills: armorData.map((skill) => ({
        skillId: skill.skillid,
        skillDescription: skill.skilldescription,
        unlockSkillLv: skill.unlockskilllv,
      })),
    };

    // Nettoyer les chaînes de caractères dans l'objet data
    const cleanData = JSON.parse(JSON.stringify(armor, (key, value) => 
        typeof value === "string" ? value.replace(/\u00A0/g, " ") : value
    ));
        
        
    res.status(200).json(cleanData);
  } catch (error) {
    console.error("Erreur lors de la récupération des données d'armure:", error);
    res.status(500).json({ error: `Erreur interne du serveur: ${(error as Error).message}` });
  }
}
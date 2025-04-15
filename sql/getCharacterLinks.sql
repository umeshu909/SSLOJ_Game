SELECT 
  FetterBaseConfig.id AS FetterID,
  FetterBaseConfig.heroid AS HeroID,
  HeroConfig.name AS HeroName,
  HeroConfig.handbookherores AS HeroHandbook,
  FetterPowerConfig.skillid,
  SkillTextConfig.desc AS skillDescription,   -- Vérifiez si la description existe ici
  SkillTextConfig.skillid,    
  SkillTextConfig.level AS skillLevel,        -- Vérifiez si le niveau de compétence est présent
  SkillTextConfig.name AS skillName,
  HeroConfig.icon AS mainIcon,
  HeroConfigHero1.icon AS Hero1Icon,
  HeroConfigHero2.icon AS Hero2Icon,
  HeroConfigHero3.icon AS Hero3Icon,
  HeroConfigHero4.icon AS Hero4Icon
FROM FetterBaseConfig
INNER JOIN HeroConfig ON FetterBaseConfig.heroid = HeroConfig.id
INNER JOIN FetterPowerConfig ON FetterPowerConfig.partid = FetterBaseConfig.id
LEFT JOIN HeroConfig AS HeroConfigHero1 ON FetterBaseConfig.hero1 = HeroConfigHero1.id
LEFT JOIN HeroConfig AS HeroConfigHero2 ON FetterBaseConfig.hero2 = HeroConfigHero2.id
LEFT JOIN HeroConfig AS HeroConfigHero3 ON FetterBaseConfig.hero3 = HeroConfigHero3.id
LEFT JOIN HeroConfig AS HeroConfigHero4 ON FetterBaseConfig.hero4 = HeroConfigHero4.id
LEFT JOIN SkillTextConfig ON SkillTextConfig.skillid = FetterPowerConfig.skillid
LEFT JOIN SkillConfig ON SkillConfig.skillid = SkillTextConfig.skillid AND SkillConfig.level = SkillTextConfig.level
WHERE HeroConfig.id = ?
OR FetterBaseConfig.hero1 = ?
OR FetterBaseConfig.hero2 = ?
OR FetterBaseConfig.hero3 = ?
OR FetterBaseConfig.hero4 = ?
ORDER BY 
CASE 
    WHEN HeroConfig.id = ? THEN 0 
    ELSE 1 
END;
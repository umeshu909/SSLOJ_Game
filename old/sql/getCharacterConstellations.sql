SELECT 
HeroConfig.id,
        
-- Partie pour les données des constellations
ConstellationBaseConfig.overname,
SkillConfigConstellations.icon as iconConstellation,
MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 3 THEN SkillTextConfigConstellations.name END) AS nameSkillC3,
MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 3 THEN SkillTextConfigConstellations.desc END) AS SkillC3,
MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 9 THEN SkillTextConfigConstellations.name END) AS nameSkillC9,
MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 9 THEN SkillTextConfigConstellations.desc END) AS SkillC9
            
FROM HeroConfig
LEFT JOIN ConstellationBaseConfig ON ConstellationBaseConfig.heroid = HeroConfig.id
LEFT JOIN SkillTextConfig AS SkillTextConfigConstellations ON SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid
LEFT JOIN SkillConfig AS SkillConfigConstellations ON SkillConfigConstellations.skillid = SkillTextConfigConstellations.skillid AND SkillConfigConstellations.level = SkillTextConfigConstellations.level
WHERE HeroConfig.id = ?
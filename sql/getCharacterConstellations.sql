SELECT 
ConstellationBaseConfig.overname,
SkillConfigConstellations.icon as iconConstellation,
ConstellationBaseConfig.suitneed,
MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 3 THEN SkillTextConfigConstellations.skillid END) AS idSkillC3,
MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 3 THEN SkillTextConfigConstellations.level END) AS levelSkillC3,
MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 3 THEN SkillTextConfigConstellations.name END) AS nameSkillC3,
MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 3 THEN SkillTextConfigConstellations.desc END) AS SkillC3,
MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 9 THEN SkillTextConfigConstellations.skillid END) AS idSkillC9,
MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 9 THEN SkillTextConfigConstellations.level END) AS levelSkillC9,
MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 9 THEN SkillTextConfigConstellations.name END) AS nameSkillC9,
MAX(CASE WHEN SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid AND ConstellationBaseConfig.suitneed = 9 THEN SkillTextConfigConstellations.desc END) AS SkillC9
FROM ConstellationBaseConfig
LEFT JOIN SkillTextConfig AS SkillTextConfigConstellations ON SkillTextConfigConstellations.skillid = ConstellationBaseConfig.skillid
LEFT JOIN SkillConfig AS SkillConfigConstellations ON SkillConfigConstellations.skillid = SkillTextConfigConstellations.skillid AND SkillConfigConstellations.level = SkillTextConfigConstellations.level
WHERE ConstellationBaseConfig.heroid = ?
GROUP BY ConstellationBaseConfig.skillid, ConstellationBaseConfig.suitneed
SELECT  DISTINCT
    ChurchBaseConfig.id,
    ChurchBaseConfig.name,
    ChurchBaseConfig.headicon AS icon,
	
	SkillTextConfig.skillid AS skillid,
	SkillTextConfig.level AS level,
    SkillConfig.icon AS iconSkill,
    SkillTextConfig.name AS nameSkill,
    SkillTextConfig.desc AS textSkill
	
FROM ChurchBaseConfig

LEFT JOIN SkillTextConfig ON SkillTextConfig.skillid IN (
    ChurchBaseConfig.skill01,
	ChurchBaseConfig.skill02,
	ChurchBaseConfig.skill03
)
LEFT JOIN SkillConfig ON SkillConfig.skillid = SkillTextConfig.skillid

WHERE ChurchBaseConfig.id = ?
ORDER BY ChurchBaseConfig.id, SkillConfig.skillid, SkillConfig.level 
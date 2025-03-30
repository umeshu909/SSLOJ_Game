SELECT DISTINCT HolyMarkBaseConfig.id, HolyMarkBaseConfig.name, HolyMarkBaseConfig.pic, HolyMarkBaseConfig.quality, 
SkillTextConfig.skillid,
SkillTextConfig.name AS skillname,
SkillTextConfig.level,
SkillConfig.icon,
SkillTextConfig.desc 
FROM HolyMarkBaseConfig
INNER JOIN SkillTextConfig ON ( SkillTextConfig.skillid = HolyMarkBaseConfig.skill1 
                             OR SkillTextConfig.skillid = HolyMarkBaseConfig.skill2 
                             OR SkillTextConfig.skillid = HolyMarkBaseConfig.skill3 )
INNER JOIN SkillConfig ON SkillConfig.skillid = SkillTextConfig.skillid
WHERE HolyMarkBaseConfig.id = ?
AND SkillTextConfig.desc != '' ;
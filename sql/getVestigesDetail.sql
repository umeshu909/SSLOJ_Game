SELECT DISTINCT HolyMarkBaseConfig.id, HolyMarkBaseConfig.name, HolyMarkBaseConfig.pic, HolyMarkBaseConfig.quality, 
SkillTextConfig.skillid,
SkillTextConfig.name AS skillname,
SkillTextConfig.level,
SkillConfig.starttm,
SkillConfig.skillendtm,
SkillConfig.precd,
SkillConfig.cd,
SkillConfig.icon,
SkillTextConfig.desc 
FROM HolyMarkBaseConfig
INNER JOIN SkillTextConfig ON ( SkillTextConfig.skillid = HolyMarkBaseConfig.skill1 
                             OR SkillTextConfig.skillid = HolyMarkBaseConfig.skill2 
                             OR SkillTextConfig.skillid = HolyMarkBaseConfig.skill3 )
INNER JOIN SkillConfig ON SkillConfig.skillid = SkillTextConfig.skillid AND SkillConfig.level = SkillTextConfig.level
WHERE HolyMarkBaseConfig.id = ?
AND SkillTextConfig.desc != '' ;
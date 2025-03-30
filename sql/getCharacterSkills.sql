SELECT 
HeroConfig.id,
HeroConfig.mainskill,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.mainskill AND SkillTextConfig.level = 1 THEN SkillTextConfig.name END) AS nameSkill1,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.mainskill AND SkillTextConfig.level = 1 THEN SkillTextConfig.desc END) AS Skill1Level1,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.mainskill AND SkillTextConfig.level = 2 THEN SkillTextConfig.desc END) AS Skill1Level2,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.mainskill AND SkillTextConfig.level = 3 THEN SkillTextConfig.desc END) AS Skill1Level3,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.mainskill AND SkillTextConfig.level = 4 THEN SkillTextConfig.desc END) AS Skill1Level4,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.mainskill AND SkillConfig.level = 1 THEN SkillConfig.icon END) AS iconSkill1,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.mainskill AND SkillConfig.level = 1 THEN SkillConfig.starttm END) AS startSkill1,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.mainskill AND SkillConfig.level = 1 THEN SkillConfig.skillendtm END) AS endSkill1,
MAX(CASE WHEN SkillShowConfig.id = HeroConfig.mainskill THEN SkillShowConfig.skillTipsTyple END) AS skillTag1,
MAX(CASE WHEN SkillShowConfig.id = HeroConfig.mainskill THEN SkillShowConfig.original END) AS skillOriginal1,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.mainskill AND SkillConfig.level = 1 THEN SkillConfig.precd END) AS skillDelay1,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.mainskill AND SkillConfig.level = 1 THEN SkillConfig.cd END) AS skillCooldown1,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.mainskill AND SkillConfig.level = 1 THEN SkillConfig.angerattack END) AS skillregenAttack1,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.mainskill AND SkillConfig.level = 1 THEN SkillConfig.angerbeattack END) AS skillregenDamage1,

HeroConfig.skill2,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill2 AND SkillTextConfig.level = 1 THEN SkillTextConfig.name END) AS nameSkill2,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill2 AND SkillTextConfig.level = 1 THEN SkillTextConfig.desc END) AS Skill2Level1,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill2 AND SkillTextConfig.level = 2 THEN SkillTextConfig.desc END) AS Skill2Level2,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill2 AND SkillTextConfig.level = 3 THEN SkillTextConfig.desc END) AS Skill2Level3,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill2 AND SkillTextConfig.level = 4 THEN SkillTextConfig.desc END) AS Skill2Level4,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill2 AND SkillConfig.level = 1 THEN SkillConfig.icon END) AS iconSkill2,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill2 AND SkillConfig.level = 1 THEN SkillConfig.skillendtm END) AS endSkill2,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill2 AND SkillConfig.level = 1 THEN SkillConfig.starttm END) AS startSkill2,
MAX(CASE WHEN SkillShowConfig.id = HeroConfig.skill2 THEN SkillShowConfig.skillTipsTyple END) AS skillTag2,
MAX(CASE WHEN SkillShowConfig.id = HeroConfig.skill2 THEN SkillShowConfig.original END) AS skillOriginal2,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill2 AND SkillConfig.level = 1 THEN SkillConfig.precd END) AS skillDelay2,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill2 AND SkillConfig.level = 1 THEN SkillConfig.cd END) AS skillCooldown2,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill2 AND SkillConfig.level = 1 THEN SkillConfig.angerattack END) AS skillregenAttack2,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill2 AND SkillConfig.level = 1 THEN SkillConfig.angerbeattack END) AS skillregenDamage2,

HeroConfig.skill3,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill3 AND SkillTextConfig.level = 1 THEN SkillTextConfig.name END) AS nameSkill3,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill3 AND SkillTextConfig.level = 1 THEN SkillTextConfig.desc END) AS Skill3Level1,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill3 AND SkillTextConfig.level = 2 THEN SkillTextConfig.desc END) AS Skill3Level2,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill3 AND SkillTextConfig.level = 3 THEN SkillTextConfig.desc END) AS Skill3Level3,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill3 AND SkillTextConfig.level = 4 THEN SkillTextConfig.desc END) AS Skill3Level4,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill3 AND SkillConfig.level = 1 THEN SkillConfig.icon END) AS iconSkill3,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill3 AND SkillConfig.level = 1 THEN SkillConfig.starttm END) AS startSkill3,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill3 AND SkillConfig.level = 1 THEN SkillConfig.skillendtm END) AS endSkill3,
MAX(CASE WHEN SkillShowConfig.id = HeroConfig.skill3 THEN SkillShowConfig.skillTipsTyple END) AS skillTag3,
MAX(CASE WHEN SkillShowConfig.id = HeroConfig.skill3 THEN SkillShowConfig.original END) AS skillOriginal3,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill3 AND SkillConfig.level = 1 THEN SkillConfig.precd END) AS skillDelay3,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill3 AND SkillConfig.level = 1 THEN SkillConfig.cd END) AS skillCooldown3,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill3 AND SkillConfig.level = 1 THEN SkillConfig.angerattack END) AS skillregenAttack3,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill3 AND SkillConfig.level = 1 THEN SkillConfig.angerbeattack END) AS skillregenDamage3,

HeroConfig.skill4,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill4 AND SkillTextConfig.level = 1 THEN SkillTextConfig.name END) AS nameSkill4,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill4 AND SkillTextConfig.level = 1 THEN SkillTextConfig.desc END) AS Skill4Level1,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill4 AND SkillTextConfig.level = 2 THEN SkillTextConfig.desc END) AS Skill4Level2,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill4 AND SkillTextConfig.level = 3 THEN SkillTextConfig.desc END) AS Skill4Level3,
MAX(CASE WHEN SkillTextConfig.skillid = HeroConfig.skill4 AND SkillTextConfig.level = 4 THEN SkillTextConfig.desc END) AS Skill4Level4,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill4 AND SkillConfig.level = 1 THEN SkillConfig.icon END) AS iconSkill4,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill4 AND SkillConfig.level = 1 THEN SkillConfig.starttm END) AS startSkill4,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill4 AND SkillConfig.level = 1 THEN SkillConfig.skillendtm END) AS endSkill4,
MAX(CASE WHEN SkillShowConfig.id = HeroConfig.skill4 THEN SkillShowConfig.skillTipsTyple END) AS skillTag4,
MAX(CASE WHEN SkillShowConfig.id = HeroConfig.skill4 THEN SkillShowConfig.original END) AS skillOriginal4,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill4 AND SkillConfig.level = 1 THEN SkillConfig.precd END) AS skillDelay4,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill4 AND SkillConfig.level = 1 THEN SkillConfig.cd END) AS skillCooldown4,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill4 AND SkillConfig.level = 1 THEN SkillConfig.angerattack END) AS skillregenAttack4,
MAX(CASE WHEN SkillConfig.skillid = HeroConfig.skill4 AND SkillConfig.level = 1 THEN SkillConfig.angerbeattack END) AS skillregenDamage4
                        
FROM HeroConfig
LEFT JOIN SkillTextConfig 
ON SkillTextConfig.skillid IN (
    HeroConfig.mainskill, 
    HeroConfig.skill2, 
    HeroConfig.skill3, 
    HeroConfig.skill4
)
LEFT JOIN SkillConfig ON SkillConfig.skillid IN (
    HeroConfig.mainskill, 
    HeroConfig.skill2, 
    HeroConfig.skill3, 
    HeroConfig.skill4
)
LEFT JOIN SkillShowConfig ON SkillShowConfig.id IN (
    HeroConfig.mainskill, 
    HeroConfig.skill2, 
    HeroConfig.skill3, 
    HeroConfig.skill4
)

WHERE HeroConfig.id = ?;
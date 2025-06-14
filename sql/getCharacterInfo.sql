SELECT 
HeroConfig.id,
HeroConfig.name, 
HeroConfig.firstname, 
HeroConfig.lastname,
ROUND(HeroConfig.hp + ((HeroConfig.hpup + (HeroConfig.hpup * 10.2)) * (240 - 1)) + HeroAwakeInfoConfig.propval1 + (HeroAwakeInfoConfig.propval4 * (240 - 1))) AS HP,
ROUND(HeroConfig.atvalue + ((HeroConfig.atvalueup + (HeroConfig.atvalueup * 10.2)) * (240 - 1)) + HeroAwakeInfoConfig.propval2 + (HeroAwakeInfoConfig.propval5 * (240 - 1))) AS ATK,
ROUND(HeroConfig.dfvalue + ((HeroConfig.dfvalueup + (HeroConfig.dfvalueup * 10.2)) * (240 - 1)) + HeroAwakeInfoConfig.propval3 + (HeroAwakeInfoConfig.propval6 * (240 - 1))) AS DEF,
HeroConfig.attackspeed AS IntervalAttack,
(HeroConfig.hitrate * 100) AS VitesseAttaque,
(HeroConfig.pcritlv / 10) AS TauxCrit,
(HeroConfig.rcritlv / 10) AS Tenacite,
HeroConfig.hit AS Frappe,
HeroConfig.angerattack AS angerattack,
HeroConfig.angerbeattack AS angerbeattack,
CASE HeroConfig.profession
    WHEN 1 THEN 'Tank'
    WHEN 2 THEN 'Guerrier'
    WHEN 3 THEN 'Compétence'
    WHEN 4 THEN 'Assassin'
    WHEN 5 THEN 'Support'
END AS Category,
CASE HeroConfig.party
    WHEN 1 THEN 'Eau'
    WHEN 2 THEN 'Feu'
    WHEN 3 THEN 'Vent'
    WHEN 4 THEN 'Terre'
    WHEN 5 THEN 'Lumière'
    WHEN 6 THEN 'Ombre'
END AS Type,

-- Partie pour les descriptions
HeroConfig.herodesc,
HeroStoryConfig.describe,

-- Partie pour les images liées au personnage
HeroConfig.tenheroroledrawing,
HeroConfig.handbookherores, 
HeroConfig.herodrawing,
HeroConfig.icon AS heroIcon

 
FROM HeroConfig


LEFT JOIN HeroStoryConfig ON HeroStoryConfig.id = HeroConfig.id
LEFT JOIN HeroAwakeInfoConfig ON HeroAwakeInfoConfig.heroid = HeroConfig.id AND HeroAwakeInfoConfig.lv = 16

WHERE HeroConfig.id = ?
AND HeroConfig.initialstar = '5'
GROUP BY 
HeroConfig.name, 
HeroConfig.firstname, 
HeroConfig.hp, 
HeroConfig.hpup, 
HeroConfig.atvalue, 
HeroConfig.atvalueup, 
HeroConfig.dfvalue, 
HeroConfig.dfvalueup, 
HeroConfig.attackspeed, 
HeroConfig.hitrate, 
HeroConfig.pcritlv, 
HeroConfig.rcritlv, 
HeroConfig.hit, 
HeroConfig.profession, 
HeroConfig.party;
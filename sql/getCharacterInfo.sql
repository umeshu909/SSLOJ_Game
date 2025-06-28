SELECT 
  HeroConfig.id,
  HeroConfig.name, 
  HeroConfig.firstname, 
  HeroConfig.lastname,

  ROUND(
    HeroConfig.hp + 
    ((HeroConfig.hpup + (HeroConfig.hpup * 
      CASE WHEN HeroConfig.initialstar = 5 THEN 10.2 ELSE 5.2 END)) * 
      (CASE WHEN HeroConfig.initialstar = 5 THEN 239 ELSE 159 END)) + 
    HeroAwakeInfoConfig.propval1 + 
    (HeroAwakeInfoConfig.propval4 * 
      (CASE WHEN HeroConfig.initialstar = 5 THEN 239 ELSE 159 END))
  ) AS HP,

  ROUND(
    HeroConfig.atvalue + 
    ((HeroConfig.atvalueup + (HeroConfig.atvalueup * 
      CASE WHEN HeroConfig.initialstar = 5 THEN 10.2 ELSE 5.2 END)) * 
      (CASE WHEN HeroConfig.initialstar = 5 THEN 239 ELSE 159 END)) + 
    HeroAwakeInfoConfig.propval2 + 
    (HeroAwakeInfoConfig.propval5 * 
      (CASE WHEN HeroConfig.initialstar = 5 THEN 239 ELSE 159 END))
  ) AS ATK,

  ROUND(
    HeroConfig.dfvalue + 
    ((HeroConfig.dfvalueup + (HeroConfig.dfvalueup * 
      CASE WHEN HeroConfig.initialstar = 5 THEN 10.2 ELSE 5.2 END)) * 
      (CASE WHEN HeroConfig.initialstar = 5 THEN 239 ELSE 159 END)) + 
    HeroAwakeInfoConfig.propval3 + 
    (HeroAwakeInfoConfig.propval6 * 
      (CASE WHEN HeroConfig.initialstar = 5 THEN 239 ELSE 159 END))
  ) AS DEF,

  HeroConfig.attackspeed AS IntervalAttack,
  (HeroConfig.hitrate * 100) AS VitesseAttaque,
  (HeroConfig.pcritlv / 10) AS TauxCrit,
  (HeroConfig.rcritlv / 10) AS Tenacite,
  HeroConfig.hit AS Frappe,
  HeroConfig.angerattack AS angerattack,
  HeroConfig.angerbeattack AS angerbeattack,
  HeroConfig.initialstar,

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

  HeroConfig.herodesc,
  HeroStoryConfig.describe,
  HeroConfig.tenheroroledrawing,
  HeroConfig.handbookherores,
  HeroConfig.herodrawing,
  HeroConfig.icon AS heroIcon

FROM HeroConfig

LEFT JOIN HeroStoryConfig ON HeroStoryConfig.id = HeroConfig.id

LEFT JOIN HeroAwakeInfoConfig 
  ON HeroAwakeInfoConfig.heroid = HeroConfig.id 
  AND HeroAwakeInfoConfig.lv = CASE 
    WHEN HeroConfig.initialstar = 5 THEN 16 
    ELSE 8 
  END

WHERE HeroConfig.id = ?

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

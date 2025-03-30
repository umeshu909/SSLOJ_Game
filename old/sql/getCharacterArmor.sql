SELECT 
  HeroConfig.id,
  ArmorInfoConfig.icon,
  ArmorInfoConfig.overname,
  AC_Armor1.name AS ArmorAttrib1, AC_Armor1.percent AS percentArmor1, ArmorInfoConfig.grownum1,
  AC_Armor2.name AS ArmorAttrib2, AC_Armor2.percent AS percentArmor2, ArmorInfoConfig.grownum2,
  AC_Armor3.name AS ArmorAttrib3, AC_Armor3.percent AS percentArmor3, ArmorInfoConfig.grownum3,
  AC_Armor4.name AS ArmorAttrib4, AC_Armor4.percent AS percentArmor4, ArmorInfoConfig.grownum4,
  HeroConfig.party AS party,
  ArmorSkillConfig.skillid AS skillid,
  ArmorSkillConfig.skilldescription AS skilldescription,
  ArmorSkillConfig.unlockskilllv AS unlockskilllv,
  
  -- Définir si c'est une armure de type 30 ou 40
  CASE 
    WHEN HeroConfig.party = 5 THEN 40
    ELSE 30 
  END AS armorType -- Type d'armure (30 ou 40)

FROM ArmorInfoConfig
LEFT JOIN ArmorSkillConfig 
  ON ArmorSkillConfig.heroid = ArmorInfoConfig.heroid
LEFT JOIN AttributeConfig AS AC_Armor1 ON AC_Armor1.id = ArmorInfoConfig.attributeid1
LEFT JOIN AttributeConfig AS AC_Armor2 ON AC_Armor2.id = ArmorInfoConfig.attributeid2
LEFT JOIN AttributeConfig AS AC_Armor3 ON AC_Armor3.id = ArmorInfoConfig.attributeid3
LEFT JOIN AttributeConfig AS AC_Armor4 ON AC_Armor4.id = ArmorInfoConfig.attributeid4
LEFT JOIN HeroConfig ON HeroConfig.id = ArmorInfoConfig.heroid -- Joindre HeroConfig pour récupérer party
WHERE ArmorInfoConfig.heroid = ?;
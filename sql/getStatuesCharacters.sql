SELECT  
    StatueBaseConfig.id as charaId,
    ChurchBaseConfig.id,
    ChurchBaseConfig.name,
    HeroConfig.handbookherores,
    HeroConfig.name,
    HeroConfig.id,
    HeroConfig.icon,
    AC_Statue1.name AS Attrib1,
    AC_Statue1.percent AS Percent1,
    StatueBaseConfig.valup1,
    AC_Statue2.name AS Attrib2,
    AC_Statue2.percent AS Percent2,
    StatueBaseConfig.valup2,
    AC_Statue3.name AS Attrib3,
    AC_Statue3.percent AS Percent3,
    StatueBaseConfig.valup3
FROM StatueBaseConfig
INNER JOIN ChurchBaseConfig ON ChurchBaseConfig.id = StatueBaseConfig.toid
INNER JOIN HeroConfig ON HeroConfig.id = StatueBaseConfig.hero
LEFT JOIN AttributeConfig AS AC_Statue1 ON AC_Statue1.id = StatueBaseConfig.propid1
LEFT JOIN AttributeConfig AS AC_Statue2 ON AC_Statue2.id = StatueBaseConfig.propid2
LEFT JOIN AttributeConfig AS AC_Statue3 ON AC_Statue3.id = StatueBaseConfig.propid3
WHERE ChurchBaseConfig.id = ?
ORDER BY ChurchBaseConfig.id, HeroConfig.name
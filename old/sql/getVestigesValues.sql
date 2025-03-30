SELECT 
HolyMarkCareerConfig.metier,
CASE HolyMarkCareerConfig.metier
  WHEN 1 THEN 'Tank'
  WHEN 2 THEN 'Guerrier'
  WHEN 3 THEN 'Competence'
  WHEN 4 THEN 'Assassin'
  ELSE 'Assistant'
END AS metierText,
HolyMarkCareerConfig.times,
AC_Vestige1.name AS Attrib1,
CASE AC_Vestige1.percent
  WHEN 0 THEN CAST(HolyMarkCareerConfig.value1 AS TEXT)
  ELSE CAST(HolyMarkCareerConfig.value1 * 100 AS TEXT) || '%'
END AS value1,
AC_Vestige2.name AS Attrib2,
CASE AC_Vestige2.percent
  WHEN 0 THEN CAST(HolyMarkCareerConfig.value2 AS TEXT)
  ELSE CAST(HolyMarkCareerConfig.value2 * 100 AS TEXT) || '%'
END AS value2,
AC_Vestige3.name AS Attrib3,
CASE AC_Vestige3.percent
  WHEN 0 THEN CAST(HolyMarkCareerConfig.value3 AS TEXT)
  ELSE CAST(HolyMarkCareerConfig.value3 * 100 AS TEXT) || '%'
END AS value3,
AC_Vestige4.name AS Attrib4,
CASE AC_Vestige4.percent
  WHEN 0 THEN CAST(HolyMarkCareerConfig.value4 AS TEXT)
  ELSE CAST(HolyMarkCareerConfig.value4 * 100 AS TEXT) || '%'
END AS value4
FROM HolyMarkCareerConfig
LEFT JOIN AttributeConfig AS AC_Vestige1 ON AC_Vestige1.id = HolyMarkCareerConfig.prop1
LEFT JOIN AttributeConfig AS AC_Vestige2 ON AC_Vestige2.id = HolyMarkCareerConfig.prop2
LEFT JOIN AttributeConfig AS AC_Vestige3 ON AC_Vestige3.id = HolyMarkCareerConfig.prop3
LEFT JOIN AttributeConfig AS AC_Vestige4 ON AC_Vestige4.id = HolyMarkCareerConfig.prop4
WHERE hmid = ?
AND times = ?;

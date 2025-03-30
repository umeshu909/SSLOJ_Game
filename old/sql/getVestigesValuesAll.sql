SELECT 
AC_Vestige1.name AS AttribAll1,
CASE AC_Vestige1.percent
	WHEN 0 THEN HolyMarkAllConfig.value1
	ELSE CAST(HolyMarkAllConfig.value1 * 100 as text)  || '%'
END AS valueAll1,
AC_Vestige2.name AS AttribAll2,
CASE AC_Vestige2.percent
	WHEN 0 THEN HolyMarkAllConfig.value2
	ELSE CAST(HolyMarkAllConfig.value2 * 100 as text)  || '%'
END AS valueAll2,
AC_Vestige3.name AS AttribAll3,
CASE AC_Vestige3.percent
	WHEN 0 THEN HolyMarkAllConfig.value3
	ELSE CAST(HolyMarkAllConfig.value3 * 100 as text)  || '%'
END AS valueAll3
FROM HolyMarkAllConfig
LEFT JOIN AttributeConfig AS AC_Vestige1 ON AC_Vestige1.id = HolyMarkAllConfig.prop1
LEFT JOIN AttributeConfig AS AC_Vestige2 ON AC_Vestige2.id = HolyMarkAllConfig.prop2
LEFT JOIN AttributeConfig AS AC_Vestige3 ON AC_Vestige3.id = HolyMarkAllConfig.prop3
WHERE HolyMarkAllConfig.times1 = ?
AND HolyMarkAllConfig.quality = ?
SELECT 
ep.id,
ep.name,  
'/images/atlas/icon_alaya/' || ep.pic || '.png' AS pic,
CASE ep.quality
    WHEN 1 THEN 'Gris'
    WHEN 2 THEN 'Bleu'
    WHEN 3 THEN 'Violet'
    WHEN 4 THEN 'Or'
    WHEN 5 THEN 'Rouge'
END AS quality,
ep.condition,
ep.level AS levelMax, 
ep.skillid, 
stc.id as skillid_id,
stc.level AS level,
1 AS coeff,
SkillValueConfig.constval,
stc.desc, 
ac1.name AS Attrib1, 
ac1.percent AS Percent1,
ep.value1, 
ep.gwnum1, 
ac2.name AS Attrib2, 
ac2.percent AS Percent2,
ep.value2, 
ep.gwnum2, 
ac3.name AS Attrib3, 
ac3.percent AS Percent3,
ep.value3, 
ep.gwnum3, 
ac4.name AS Attrib4, 
ac4.percent AS Percent4,
ep.value4,
ep.gwnum4,
ep.param,
'Poséidon' AS hero_names,
'touxiang_bosaidong_haihuang' AS hero_imgs
FROM 
EndlessPowerConfig ep
LEFT JOIN 
SkillTextConfig stc ON stc.skillid = ep.skillid 
LEFT JOIN 
SkillValueConfig ON SkillValueConfig.id = (stc.skillid + (stc.level - 1))
LEFT JOIN 
AttributeConfig ac1 ON ac1.id = ep.prop1
LEFT JOIN 
AttributeConfig ac2 ON ac2.id = ep.prop2
LEFT JOIN 
AttributeConfig ac3 ON ac3.id = ep.prop3
LEFT JOIN 
AttributeConfig ac4 ON ac4.id = ep.prop4

WHERE 
ep.id = "750008";
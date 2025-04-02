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
  ep.level,
  ac1.name AS Attrib1,
  ac2.name AS Attrib2,
  ac3.name AS Attrib3,
  ac4.name AS Attrib4
FROM EndlessPowerConfig ep
LEFT JOIN AttributeConfig ac1 ON ac1.id = ep.prop1
LEFT JOIN AttributeConfig ac2 ON ac2.id = ep.prop2
LEFT JOIN AttributeConfig ac3 ON ac3.id = ep.prop3
LEFT JOIN AttributeConfig ac4 ON ac4.id = ep.prop4
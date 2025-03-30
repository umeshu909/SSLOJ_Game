SELECT DISTINCT
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
ep.level
FROM 
EndlessPowerConfig ep
LEFT JOIN 
SkillTextConfig stc ON stc.skillid = ep.skillid 
WHERE ep.level = ? AND stc.level = 1;
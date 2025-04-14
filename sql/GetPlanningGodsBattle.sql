SELECT 
    opentime AS 'Start',
    closetime AS 'End',
    buffid1,
    buffid2,
    buffid3,
    b1.desc AS BuffText1,
    b2.desc AS BuffText2,
    b3.desc AS BuffText3
FROM GodsOpenConfig
LEFT JOIN GodsBuffConfig b1 
ON b1.id = buffid1
LEFT JOIN GodsBuffConfig b2 
ON b2.id = buffid2
LEFT JOIN GodsBuffConfig b3 
ON b3.id = buffid3
WHERE opentime >= datetime('now', '-14 days')
ORDER BY opentime ASC;
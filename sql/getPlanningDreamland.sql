SELECT 
d.opentime AS 'Start',
d.duration AS duration,
CASE d.mapgroup 
    WHEN 1 THEN 'Poseidon'
    WHEN 2 THEN 'Pope'
END AS 'Map',
d.buffid,
substr(d.buffid,1,2) AS buffid1,
substr(d.buffid,4,2) AS buffid2,
substr(d.buffid,7,2) AS buffid3,
b1.desc AS BuffText1,
b2.desc AS BuffText2,
b3.desc AS BuffText3
FROM DreamlandOpenConfig d
LEFT JOIN DreamlandBuffConfig b1 
ON b1.id = buffid1
LEFT JOIN DreamlandBuffConfig b2 
ON b2.id = buffid2
LEFT JOIN DreamlandBuffConfig b3 
ON b3.id = buffid3
WHERE d.opentime >= datetime('now', '-40 days')
ORDER BY d.opentime ASC;
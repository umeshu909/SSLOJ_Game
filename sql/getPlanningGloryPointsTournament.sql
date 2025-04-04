SELECT 
    opentime AS 'Start'
FROM GloryOpentimeConfig
WHERE opentime >= datetime('now', '-14 days')
ORDER BY opentime ASC;
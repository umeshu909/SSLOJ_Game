SELECT 
    opentime AS 'Start'
FROM GloryOpentimeConfig
WHERE opentime >= datetime('now', '-40 days')
ORDER BY opentime ASC;
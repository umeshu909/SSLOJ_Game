SELECT 
    opentime AS 'Start',
    closetime AS 'End'
FROM KaiQiConfig
WHERE opentime >= datetime('now', '-14 days')
ORDER BY opentime ASC;
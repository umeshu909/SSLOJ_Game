SELECT 
    opentime AS 'Start',
    datetime(closetime, '-4 days') AS 'End'
FROM KaiQiConfig
WHERE opentime >= datetime('now', '-40 days')
ORDER BY opentime ASC;
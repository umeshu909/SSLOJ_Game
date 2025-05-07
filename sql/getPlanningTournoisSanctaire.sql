SELECT 
    opentime AS 'Start',
    closetime AS 'End'
FROM BattleTimeConfig
WHERE opentime >= datetime('now', '-40 days')
ORDER BY opentime ASC;
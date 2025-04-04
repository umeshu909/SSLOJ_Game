SELECT 
    opentime AS 'Opening',
    enrollday || 'days' AS 'Pre-register',
    quietday || 'days'  AS 'Stamina period',
    (stopday - quietday) || 'days'  AS 'Silence Period',
    totaldays || 'days'  AS 'Total Nb days',
    peoplenum AS 'Nb players'
FROM RuinsMapConfig
WHERE opentime >= datetime('now', '-14 days')
ORDER BY opentime ASC;
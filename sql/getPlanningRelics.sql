SELECT 
    opentime AS start,
    enrollday AS enrollday,
    quietday AS stamina_days,
    (stopday - quietday) AS silence_days,
    totaldays AS total_days,
    peoplenum AS players
FROM RuinsMapConfig
WHERE opentime >= datetime('now', '-14 days')
ORDER BY opentime ASC;

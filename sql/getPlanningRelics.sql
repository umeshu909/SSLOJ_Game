SELECT 
    opentime AS start,
    enrollday AS enrollday,
    (quietday - 1) AS stamina_days,
    (stopday - quietday + 1) AS silence_days,
    totaldays AS total_days,
    peoplenum AS players
FROM RuinsMapConfig
WHERE opentime >= datetime('now', '-40 days')
ORDER BY opentime ASC;

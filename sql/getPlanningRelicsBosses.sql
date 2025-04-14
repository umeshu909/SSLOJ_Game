SELECT id, costpower, rebirthtime, unlocktime
FROM RuinsNpcAttributeConfig
WHERE unlocktime IS NOT NULL AND unlocktime <> '' AND unlocktime <> '0'
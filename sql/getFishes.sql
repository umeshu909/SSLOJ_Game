SELECT 
    'Zone ' || FishSpeciesConfig.fisheryid AS 'ZoneNom',
    FishSpeciesConfig.fisheryid AS 'Zone',
    ItemConfigFish.id,
    ItemConfigFish.name AS 'Poisson',
    ItemConfigBait.name AS 'Appât',

    FishSpeciesConfig.fishgrade,
    CASE FishSpeciesConfig.fishgrade
        WHEN 1 THEN 'Bleu'
        WHEN 2 THEN 'Violet'
        WHEN 3 THEN 'Or'
        WHEN 4 THEN 'Rouge'
        WHEN 5 THEN 'Platine'
    END AS 'Grade',

    FishSpeciesConfig.fishspecies,
    CASE FishSpeciesConfig.fishspecies
        WHEN 1 THEN 'Small (Skilled)'
        WHEN 2 THEN 'Medium (Assassins)'
        WHEN 3 THEN 'Large (Warriors)'
        WHEN 4 THEN 'Sea creatures (Assistants)'
        WHEN 5 THEN 'Crustaceans (Protectors)'
        WHEN 6 THEN 'Treasures'
    END AS 'Espece',

    FishSpeciesConfig.iconid,
    ItemConfigBait.icon AS iconid2,

    AttribVal1.name AS 'stat1',
    AttribVal2.name AS 'stat2',
    AttribVal3.name AS 'stat3'

FROM FishSpeciesConfig

LEFT JOIN ItemConfig AS ItemConfigFish ON ItemConfigFish.id = FishSpeciesConfig.fishid
LEFT JOIN ItemConfig AS ItemConfigBait ON ItemConfigBait.id = FishSpeciesConfig.baitid

LEFT JOIN AttributeConfig AS AttribVal1 ON AttribVal1.id = FishSpeciesConfig.propid1
LEFT JOIN AttributeConfig AS AttribVal2 ON AttribVal2.id = FishSpeciesConfig.propid2
LEFT JOIN AttributeConfig AS AttribVal3 ON AttribVal3.id = FishSpeciesConfig.propid3

WHERE FishSpeciesConfig.baitid IS NOT NULL
-- {{CONDITIONS}}
GROUP BY FishSpeciesConfig.fisheryid, ItemConfigFish.name

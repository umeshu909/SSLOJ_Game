SELECT 
CASE FishingToolConfig.id
    WHEN 0 THEN 'Canne'
    WHEN 1 THEN 'Flotteur'
    WHEN 2 THEN 'Hameçon'
    WHEN 3 THEN 'Ligne'
END AS 'Matériel',
CASE FishingToolConfig.fishinggrade
    WHEN 1 THEN 'Bleu'
    WHEN 2 THEN 'Violet'
    WHEN 3 THEN 'Or'
    WHEN 4 THEN 'Rouge'
    WHEN 5 THEN 'Platine'
END AS 'Grade',
MAX(FishingToolConfig.fishinglevel2) AS 'Niveaux',
SUM(FishingToolConfig.costnum1) AS 'Coût',
MAX(WordIdConfig.msg) AS condition,
MAX(CASE WHEN FishingToolConfig.fishinglevel2 = 1 THEN ItemConfig.icon END) AS icon
FROM FishingToolConfig
LEFT JOIN ItemConfig ON ItemConfig.id = FishingToolConfig.itemid
LEFT JOIN FishingTaskConfig on FishingTaskConfig.id = FishingToolConfig.task
LEFT JOIN WordIdConfig on WordIdConfig.id = FishingTaskConfig.describe
GROUP BY FishingToolConfig.id, FishingToolConfig.fishinggrade;
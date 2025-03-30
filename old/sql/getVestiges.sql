SELECT 
HolyMarkBaseConfig.id, 
HolyMarkBaseConfig.name, 
HolyMarkBaseConfig.pic,
HolyMarkBaseConfig.quality, 
HolyMarkBaseConfig.skillshow
FROM HolyMarkBaseConfig
WHERE quality = ?;
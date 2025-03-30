SELECT 
ArtifactDevConfig.artifactid as id, 
ArtifactDevConfig.name, 
'/images/atlas/shenqi_page/' || ArtifactDevConfig.showimg || '02.png' as icon,
CASE ArtifactPointConfig.profession
  WHEN 0 THEN 0
  ELSE 1
END AS quality
FROM ArtifactDevConfig
LEFT JOIN ArtifactPointConfig ON ArtifactPointConfig.id = ArtifactDevConfig.artifactid
WHERE level = 1
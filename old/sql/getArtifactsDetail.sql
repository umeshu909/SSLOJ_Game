SELECT 
  A.artifactid as id,
  A.name,
'/images/atlas/shenqi_page/' || A.showimg || '02.png' as icon,
  A.level,

  -- Stats actuelles (niveau sélectionné)
  AC1.name AS Attrib1,
  CASE AC1.percent
    WHEN 0 THEN CAST(A.propsum1 AS TEXT)
    ELSE CAST(A.propsum1 * 100 AS TEXT) || '%'
  END AS value1,

  AC2.name AS Attrib2,
  CASE AC2.percent
    WHEN 0 THEN CAST(A.propsum2 AS TEXT)
    ELSE CAST(A.propsum2 * 100 AS TEXT) || '%'
  END AS value2,

  AC3.name AS Attrib3,
  CASE AC3.percent
    WHEN 0 THEN CAST(A.propsum3 AS TEXT)
    ELSE CAST(A.propsum3 * 100 AS TEXT) || '%'
  END AS value3,

  -- Skill 1 (niveau 1)
  STC1.desc AS skill1,

  -- Skill 2 (niveau 3)
  STC2.desc AS skill2,

  -- Skill 3 (niveau 5)
  STC3.desc AS skill3,

CASE ArtifactPointConfig.profession
  WHEN 0 THEN 0
  ELSE 1
END AS quality

FROM ArtifactDevConfig A

LEFT JOIN ArtifactPointConfig ON ArtifactPointConfig.id = A.artifactid

-- Joins attributs
LEFT JOIN AttributeConfig AC1 ON AC1.id = A.prop1
LEFT JOIN AttributeConfig AC2 ON AC2.id = A.prop2
LEFT JOIN AttributeConfig AC3 ON AC3.id = A.prop3

-- Skill du niveau 1
LEFT JOIN (
  SELECT skillid, desc FROM SkillTextConfig WHERE level = 1
) AS STC1 ON STC1.skillid = (
  SELECT skillid FROM ArtifactDevConfig 
  WHERE artifactid = A.artifactid AND level = 1
)

-- Skill du niveau 3
LEFT JOIN (
  SELECT skillid, desc FROM SkillTextConfig WHERE level = 1
) AS STC2 ON STC2.skillid = (
  SELECT skillid FROM ArtifactDevConfig 
  WHERE artifactid = A.artifactid AND level = 3
)

-- Skill du niveau 5
LEFT JOIN (
  SELECT skillid, desc FROM SkillTextConfig WHERE level = 1
) AS STC3 ON STC3.skillid = (
  SELECT skillid FROM ArtifactDevConfig 
  WHERE artifactid = A.artifactid AND level = 5
)

-- Sélection du niveau principal
WHERE A.artifactid = ? AND A.level = ?

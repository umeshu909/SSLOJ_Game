SELECT name, icon, desc
FROM ItemConfig
WHERE logictype NOT IN ('1050','1054','1045','1046','1047','1060','1068','1073','1085','1092','1094')
  AND icon <> 'sds_zuanshixiangda_wp'
  AND name <> '';

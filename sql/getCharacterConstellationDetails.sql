SELECT SLP.id, SLP.name, SLP.quality, SLP.icon, 
AC_CD1.name AS ConstAttrib1, 
AC_CD1.percent AS percentConst1, 
SLP.value1,
AC_CD2.name AS ConstAttrib2, 
AC_CD2.percent AS percentConst2, 
SLP.value2,
AC_CD3.name AS ConstAttrib3, 
AC_CD3.percent AS percentConst3, 
( SLP.value3 + ( 3 * SLP.growvalue3) ) AS value3
from StarLifePointConfig AS SLP
LEFT JOIN AttributeConfig AS AC_CD1 ON AC_CD1.id = SLP.prop1
LEFT JOIN AttributeConfig AS AC_CD2 ON AC_CD2.id = SLP.prop2
LEFT JOIN AttributeConfig AS AC_CD3 ON AC_CD3.id = SLP.prop3
WHERE heroid = ?
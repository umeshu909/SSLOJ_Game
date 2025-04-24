SELECT id, max(idx) as maxIdx, label, currencyid
FROM ShopConfig
WHERE currencyid <> 0
  AND currencyid <> 1
GROUP BY id;

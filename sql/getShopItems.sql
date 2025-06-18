WITH LastSeries AS (
  SELECT MAX(goodsid) AS start_goodsid
  FROM GoodsConfig
  WHERE moneytype = ?
  AND goodsid % 100 = 1
),
RankedGoods AS (
  SELECT 
    GoodsConfig.id,
    GoodsConfig.goodsid, 
    GoodsConfig.objid, 
    GoodsConfig.objnum, 
    GoodsConfig.moneytype, 
    GoodsConfig.moneyprice,
    GoodsConfig.discountedPrice,
    GoodsConfig.discount,
    GoodsConfig.buytimes,
    ItemConfig.name,
    ItemConfig.icon,
    itemMoney.icon AS iconMoney,
    ROW_NUMBER() OVER (
      PARTITION BY GoodsConfig.objid, GoodsConfig.moneyprice
      ORDER BY GoodsConfig.goodsid DESC
    ) AS rn
  FROM GoodsConfig
  INNER JOIN ItemConfig ON ItemConfig.id = GoodsConfig.objid
  LEFT JOIN ItemConfig AS itemMoney ON itemMoney.id = GoodsConfig.moneytype
  WHERE GoodsConfig.moneytype = ?
  AND GoodsConfig.goodsid >= (SELECT start_goodsid FROM LastSeries)
)
SELECT *
FROM RankedGoods
WHERE rn = 1
ORDER BY moneyprice DESC, objid DESC;

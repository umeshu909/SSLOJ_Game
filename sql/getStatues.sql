SELECT
  c.id,
  c.name,
  c.headicon AS icon,

  (SELECT h.icon FROM StatueBaseConfig s
    JOIN HeroConfig h ON h.id = s.hero
    WHERE s.toid = c.id
    ORDER BY h.name
    LIMIT 1 OFFSET 0) AS hero1_icon,

  (SELECT h.icon FROM StatueBaseConfig s
    JOIN HeroConfig h ON h.id = s.hero
    WHERE s.toid = c.id
    ORDER BY h.name
    LIMIT 1 OFFSET 1) AS hero2_icon,

  (SELECT h.icon FROM StatueBaseConfig s
    JOIN HeroConfig h ON h.id = s.hero
    WHERE s.toid = c.id
    ORDER BY h.name
    LIMIT 1 OFFSET 2) AS hero3_icon,

  (SELECT h.icon FROM StatueBaseConfig s
    JOIN HeroConfig h ON h.id = s.hero
    WHERE s.toid = c.id
    ORDER BY h.name
    LIMIT 1 OFFSET 3) AS hero4_icon,

  (SELECT h.icon FROM StatueBaseConfig s
    JOIN HeroConfig h ON h.id = s.hero
    WHERE s.toid = c.id
    ORDER BY h.name
    LIMIT 1 OFFSET 4) AS hero5_icon

FROM ChurchBaseConfig c
ORDER BY c.id;

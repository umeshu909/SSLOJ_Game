export async function replacePlaceholders(
  text: string,
  db: Database
): Promise<string> {
  const matches = [...text.matchAll(/#(\d+)-(\d+)#/g)];
  if (matches.length === 0) return text;

  const replacements: Record<string, string> = {};

  for (const [full, id, idx] of matches) {
    const key = `${id}-${idx}`;
    if (replacements[key]) continue;

    try {
      const row = await db.get(
        `SELECT * FROM SkillValueConfig WHERE id = ? AND idx = ?`,
        [id, idx]
      );

      if (row) {
        let formatted: string | null = null;
        let valueToUse: number | null = null;
        const possibleValues = [
          row.constval,
          row.lvadd,
          row.atkadd,
          row.lvatkadd,
          row.addtype,
          row.petadd,
          row.padd,
          row.lvpadd,
          row.madd,
          row.lvmadd,
        ];

        for (const value of possibleValues) {
          if (value && value > 0) {
            valueToUse = value;
            break;
          }
        }

        if (valueToUse !== null) {
          if (row.tp === 1) {
            if (row.statetype === 4 || row.statetype === 2) {
              formatted = `${(valueToUse * 100).toFixed(2)}%`;
            } else if (row.statetype === 3 && row.constval) {
              formatted = `${(valueToUse / 1000).toFixed(2)}`;
            } else {
              formatted = `${valueToUse}`;
            }
          } else if (row.tp === 2) {
            if (row.statetype === 2) {
              formatted = `${valueToUse}%`;
            } else if (row.statetype === 3) {
              formatted = `${(valueToUse / 1000).toFixed(2)}`;
            } else {
              formatted = `${valueToUse}`;
            }
          }
        } else {
          formatted = "vide";
        }

        replacements[key] = formatted || '';
      } else {
        replacements[key] = "données non trouvées";
      }
    } catch (err) {
      console.error(`Erreur pour ${key}:`, err);
      replacements[key] = "erreur";
    }
  }

  let finalText = text;
  for (const key in replacements) {
    const value = replacements[key];
    finalText = finalText.replaceAll(`#${key}#`, value);
  }

  return finalText;
}

import { Database } from "sqlite";

// Fonction pour nettoyer et formater les valeurs
const clean = (val: number) =>
  Number.isInteger(val) ? val.toString() : val.toFixed(2).replace(/\.00$/, "");

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
      console.log(`→ Traitement du placeholder ${key}...`);

      const row = await db.get(
        `SELECT * FROM SkillValueConfig WHERE id = ? AND idx = ?`,
        [id, idx]
      );

      if (row) {
        let formatted: string | null = null;

        // On vérifie toutes les valeurs possibles et on prend la première qui est > 0
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
            break; // Dès qu'on trouve une valeur valide, on arrête
          }
        }

        // Si on a trouvé une valeur, on l'utilise pour le formatage
        if (valueToUse !== null) {
          if (row.tp === 1) {
            // Si tp == 1 : on applique des règles spécifiques
            if (row.statetype === 4 || row.statetype === 2) {
              // Si statetype est 4 ou 2 : on l'affiche directement en pourcentage, sans modification
              formatted = `<span style="color: #82B0D6;">${clean(valueToUse * 100)}%</span>`; // On multiplie par 100 ici pour les pourcentages
            } else if (row.statetype === 3 && row.constval) {
              // Exception : Si tp == 1 et statetype == 3, la valeur de constval doit être divisée par 1000
              formatted = `<span style="color: #82B0D6;">${clean(valueToUse / 1000)}s</span>`;  // Conversion en secondes
            } else {
              // Sinon, on affiche la valeur brute
              formatted = `<span style="color: #82B0D6;">${clean(valueToUse)}</span>`;
            }

          } else if (row.tp === 2) {
            // Si tp == 2 : on laisse la valeur brute (elle est déjà en % ou en unité brute)
            if (row.statetype === 2) {
              // Pour les statetype == 2 : afficher la valeur comme un pourcentage
              formatted = `<span style="color: #82B0D6;">${clean(valueToUse)}%</span>`;
            } else if (row.statetype === 3) {
              // Pour les statetype == 3 : convertir en secondes (divisé par 1000)
              formatted = `<span style="color: #82B0D6;">${clean(valueToUse / 1000)}s</span>`;
            } else {
              // Autres types de statetype (par exemple : valeur brute)
              formatted = `<span style="color: #82B0D6;">${clean(valueToUse)}</span>`;
            }
          }
        } else {
          // Si aucune valeur valide n'a été trouvée, afficher "vide"
          formatted = `<span style="color: #82B0D6;">vide</span>`;
        }

        replacements[key] = formatted || '';
      } else {
        replacements[key] = `<span style="color: #82B0D6;">données non trouvées</span>`; // Si pas de données, signaler l'absence de valeur
      }
    } catch (err) {
      console.error(`Erreur pour ${key}:`, err);
      replacements[key] = `<span style="color: #82B0D6;">erreur</span>`; // En cas d'erreur, signaler le problème
    }
  }

  // Appliquer les remplacements dans le texte
  let finalText = text;
  for (const key in replacements) {
    const value = replacements[key];
    finalText = finalText.replaceAll(`#${key}#`, value); // Remplacer le placeholder par sa valeur formatée
  }

  return finalText;
}
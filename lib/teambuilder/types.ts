export type Entity = { id?: string | number; name?: string; [k: string]: any };
export type Character = Entity & { image?: string; role?: number | string; type?: string };
export type Arayashiki = Entity & {
  pic?: string;
  quality?: string;
  /** Dans tes données, tu as un champ permettant de savoir qui est éligible.
   *  On supporte 2 formats possibles:
   *  - format A: param="id|id|..." (héros autorisés) -> que tu avais déjà
   *  - format B: eligibility={ all?:boolean, roles?: number[], heroes?: (string|number)[] }
   */
  param?: string | null;
  eligibility?: { all?: boolean; roles?: number[]; heroes?: (string | number)[] };
};
export type Vestige = Entity & { pic?: string };
export type Artifact = Entity & { icon?: string; profession?: number };

export type Setups = Record<string | number, {
  artifact: Artifact | null;
  arayas: (Arayashiki | null)[];
}>;
// filters.ts
import { Arayashiki, Artifact, Character } from "./types";

/* =====================
   Utilitaires communs
===================== */
export const eqId = (a: any, b: any) => String(a ?? "") === String(b ?? "");
export const asNumber = (v: any): number => {
  if (v === null || v === undefined) return NaN;
  const x = typeof v === "string" ? v.trim() : v;
  const n = Number(x);
  return Number.isFinite(n) ? n : NaN;
};
export const normalize = (s?: string) =>
  (s || "").toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

export function resolveName(e: any, fallback = ""): string {
  return (
    e?.name_translated ||
    e?.heroname_translated ||
    e?.displayName ||
    e?.name ||
    e?.heroname ||
    e?.title ||
    fallback
  );
}

export function sortCharactersLikeListing(a: any, b: any) {
  const tA = (a?.type || "").toString().toLowerCase();
  const tB = (b?.type || "").toString().toLowerCase();
  if (tA !== tB) return tA.localeCompare(tB);
  const rA = (a?.role || "").toString().toLowerCase();
  const rB = (b?.role || "").toString().toLowerCase();
  if (rA !== rB) return rA.localeCompare(rB);
  const nA = (a?.name || a?.heroname || a?.name_translated || "").toString().toLowerCase();
  const nB = (b?.name || b?.heroname || b?.name_translated || "").toString().toLowerCase();
  return nA.localeCompare(nB);
}

/* =====================
   Helpers images / overlays
===================== */
export const getCharImg = (c?: { image?: string } | null) => (c?.image ? c.image : "");
export const getArayaImg = (a?: { pic?: string } | null) => (a?.pic ? a.pic : "");
export const getArtifactImg = (a?: { icon?: string } | null) => (a?.icon ? a.icon : "");
export const arayaOverlayUrl = (quality?: string) => (quality ? `/overlays/quality-${quality}.png` : "");

/* =====================
   Rôles — normalisation (1..5)
===================== */
function roleStringToCode(s?: string | null): number | null {
  const r = normalize(s || "");
  if (!r) return null;
  if (r.includes("tank")) return 1;
  if (r.includes("guerrier") || r.includes("warrior")) return 2;
  if (r.includes("comp") || r.includes("skill") || r.includes("aptitude")) return 3; // compétence
  if (r.includes("assassin")) return 4;
  if (r.includes("support")) return 5;
  return null;
}

/** Retourne un code 1..5 si possible à partir d'un nombre, d'une string, ou d'un objet { role / profession / class / roleId / job / type }. */
export function roleAnyToCode(roleLike: any): number | null {
  // nombre direct 1..5
  const n = asNumber(roleLike);
  if (Number.isFinite(n) && n >= 1 && n <= 5) return n;

  // chaîne
  const fromStr = roleStringToCode(typeof roleLike === "string" ? roleLike : undefined);
  if (fromStr) return fromStr;

  // objets ou autres clés possibles
  if (roleLike && typeof roleLike === "object") {
    const tryKeys = ["role", "profession", "class", "roleId", "job", "type"];
    for (const k of tryKeys) {
      const v = (roleLike as any)[k];
      const n2 = asNumber(v);
      if (Number.isFinite(n2) && n2 >= 1 && n2 <= 5) return n2;
      const s2 = roleStringToCode(typeof v === "string" ? v : undefined);
      if (s2) return s2;
    }
  }
  return null;
}

export function roleCodeToLabel(code?: number | null) {
  switch (code ?? 0) {
    case 1: return "Tank";
    case 2: return "Guerrier";
    case 3: return "Compétence";
    case 4: return "Assassin";
    case 5: return "Support";
    default: return null;
  }
}

/* =====================
   Artefacts — compatibilité (DB: profession)
   0 = générique, 1..5 = restreint au rôle
===================== */
export function canUseArtifact(character?: Character | null, artifact?: Artifact | null): boolean {
  if (!artifact) return false;
  const profNum = asNumber((artifact as any)?.profession);
  const prof = Number.isFinite(profNum) ? profNum : 0;
  if (!prof) return true;              // 0 => générique
  if (!character) return false;        // sans perso, on ne valide pas les restreints
  const code = roleAnyToCode((character as any)?.role);
  return !!code && code === prof;
}

export function filterArtifactsForCharacter(artifacts: Artifact[], character?: Character | null): Artifact[] {
  return artifacts.filter((a) => canUseArtifact(character, a));
}

/* =====================
   Arayas — compatibilité (eligibility > condition/param)
   - priorité: ar.eligibility { all?, roles?, heroes? }
   - sinon: condition (0 générique, 2 rôles, 3 héros) + param "id1|id2|..."
   - fallback mixte: ok si rôle OU id correspond
===================== */

// "1|2|3" -> ["1","2","3"], "" -> []
function splitParam(param?: string | null): string[] {
  const p = (param ?? "").trim();
  if (!p) return [];
  return p.split("|").map((s) => s.trim()).filter(Boolean);
}

type ArayaRuleKind = "generic" | "byRole" | "byHeroIds" | "mixed";

function extractArayaRules(ar: any): {
  kind: ArayaRuleKind;
  roleCodes: Set<number>;
  heroIds: Set<string>;
} {
  const out = {
    kind: "generic" as ArayaRuleKind,
    roleCodes: new Set<number>(),
    heroIds: new Set<string>(),
  };

  // 1) PRIORITÉ : eligibility (Option B)
  const el = ar?.eligibility;
  if (el && typeof el === "object") {
    const all = !!el.all;
    const roles = Array.isArray(el.roles) ? el.roles : [];
    const heroes = Array.isArray(el.heroes) ? el.heroes : [];

    for (const r of roles) {
      const rc = roleAnyToCode(r);
      if (rc) out.roleCodes.add(rc);
    }
    for (const h of heroes) out.heroIds.add(String(h));

    if (all || (out.roleCodes.size === 0 && out.heroIds.size === 0)) {
      out.kind = "generic";
    } else if (out.roleCodes.size > 0 && out.heroIds.size === 0) {
      out.kind = "byRole";
    } else if (out.heroIds.size > 0 && out.roleCodes.size === 0) {
      out.kind = "byHeroIds";
    } else {
      out.kind = "mixed";
    }
    return out;
  }

  // 2) FALLBACK : condition + param
  const conditionNum = Number(ar?.condition);
  const tokens = splitParam(ar?.param);

  if (!Number.isFinite(conditionNum)) {
    // Pas de "condition" → déduire via param si possible
    for (const tok of tokens) {
      const n = Number(tok);
      if (Number.isFinite(n) && n >= 1 && n <= 5) out.roleCodes.add(n);
      else out.heroIds.add(String(tok));
    }
    if (out.roleCodes.size === 0 && out.heroIds.size === 0) {
      out.kind = "generic";
    } else if (out.roleCodes.size > 0 && out.heroIds.size === 0) {
      out.kind = "byRole";
    } else if (out.heroIds.size > 0 && out.roleCodes.size === 0) {
      out.kind = "byHeroIds";
    } else {
      out.kind = "mixed";
    }
    return out;
  }

  // Cas standards guidés par "condition"
  if (conditionNum === 0) {
    out.kind = "generic";
  } else if (conditionNum === 2) {
    out.kind = "byRole";
    for (const tok of tokens) {
      const n = Number(tok);
      if (Number.isFinite(n) && n >= 1 && n <= 5) out.roleCodes.add(n);
    }
  } else if (conditionNum === 3) {
    out.kind = "byHeroIds";
    for (const tok of tokens) out.heroIds.add(String(tok));
  } else {
    // Autre valeur → séparer
    for (const tok of tokens) {
      const n = Number(tok);
      if (Number.isFinite(n) && n >= 1 && n <= 5) out.roleCodes.add(n);
      else out.heroIds.add(String(tok));
    }
    if (out.roleCodes.size === 0 && out.heroIds.size === 0) out.kind = "generic";
    else if (out.roleCodes.size > 0 && out.heroIds.size === 0) out.kind = "byRole";
    else if (out.heroIds.size > 0 && out.roleCodes.size === 0) out.kind = "byHeroIds";
    else out.kind = "mixed";
  }

  return out;
}

export function isArayaAllowedForHero(
  ar: Arayashiki,
  heroId: string | number,
  heroRole?: any
): boolean {
  const rules = extractArayaRules(ar);
  const heroIdStr = String(heroId);
  const roleCode = roleAnyToCode(heroRole);

  if (rules.kind === "generic") return true;
  if (rules.kind === "byHeroIds") return rules.heroIds.has(heroIdStr);
  if (rules.kind === "byRole") return roleCode ? rules.roleCodes.has(roleCode) : false;

  // mixed : id OU rôle
  const idOk = rules.heroIds.size ? rules.heroIds.has(heroIdStr) : false;
  const roleOk = roleCode ? rules.roleCodes.has(roleCode) : false;
  return idOk || roleOk;
}

export function filterArayasForHero(
  all: Arayashiki[],
  hero: Character | null,
  already: (Arayashiki | null)[] = []
): Arayashiki[] {
  if (!hero) return [];
  const heroId = (hero as any)?.id;
  const heroRole = (hero as any)?.role;

  // 1) compatibilité stricte (eligibility puis fallback)
  let allowed = all.filter((ar) => isArayaAllowedForHero(ar, heroId, heroRole));

  // 2) anti-doublon sur cette ligne
  const chosen = new Set(already.filter(Boolean).map((a) => String((a as any).id)));
  allowed = allowed.filter((ar) => !chosen.has(String((ar as any).id)));

  return allowed;
}

/* =====================
   Disponibilités annexes
===================== */
export function filterAvailableCharacters(all: Character[], team: (Character | null)[]): Character[] {
  const chosen = new Set(team.filter(Boolean).map((c) => String((c as any).id)));
  return all.filter((c) => !chosen.has(String(c.id)));
}
export function filterAvailableVestiges(allVestige: any[], current: any | null) {
  if (!current) return allVestige;
  return allVestige.filter((v) => String(v.id) !== String(current.id));
}

/* =====================
   Lien partage (build/parse)
===================== */
export function buildSharableState(state: {
  team: (Character | null)[];
  setups: Record<string | number, { artifact: Artifact | null; arayas: (Arayashiki | null)[] }>;
  vestige: any;
  teamName: string;
}) {
  const { team, setups, vestige, teamName } = state;

  const teamIds = (team || []).map((ch) => (ch as any)?.id ?? null);
  const vestigeId = (vestige as any)?.id ?? null;

  const setupsIds: Record<string | number, { artifactId: any; arayaIds: any[] }> = {};
  Object.entries(setups || {}).forEach(([chId, cfg]) => {
    setupsIds[chId] = {
      artifactId: (cfg.artifact as any)?.id ?? null,
      arayaIds: (cfg.arayas || []).map((a) => (a as any)?.id ?? null),
    };
  });

  return {
    team: teamIds,
    vestigeId,
    setups: setupsIds,
    teamName: teamName ?? "",
    v: 1, // version
  };
}

export function parseSharableState(obj: any): {
  team: (string | number | null)[];
  vestigeId: string | number | null;
  setups: Record<string | number, { artifactId: string | number | null; arayaIds: (string | number | null)[] }>;
  teamName: string;
} {
  if (!obj || typeof obj !== "object") {
    return { team: [null, null, null, null, null], vestigeId: null, setups: {}, teamName: "" };
  }
  const team = Array.isArray(obj.team) ? obj.team : [null, null, null, null, null];
  const vestigeId = obj.vestigeId ?? null;
  const setups = obj.setups ?? {};
  const teamName = typeof obj.teamName === "string" ? obj.teamName : "";
  return { team, vestigeId, setups, teamName };
}
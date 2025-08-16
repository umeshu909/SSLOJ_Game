"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import IconCanvas from "@/components/IconCanvas";
import { useTranslation } from 'next-i18next'

/**
 * SSLOJ — Team Builder (configs locales)
 * - Bouton "Sauvegarder" déplacé en bas (utilise le Nom de la team)
 * - Liste des configs en haut : Nom + 5 miniatures persos + suppression
 * - Anti-doublons, filtres, export/partage inchangés
 */

const DATA_SOURCES = {
  characters: "/api/characters",
  arayashikis: "/api/arayashikis",
  vestiges: "/api/vestiges",
  artifacts: "/api/artifacts",
} as const;

export type Entity = { id?: string | number; name?: string; [k: string]: any };
export type Character = Entity & { image?: string };
export type Arayashiki = Entity & { pic?: string; quality?: string; param?: string | null };
export type Vestige = Entity & { pic?: string };
export type Artifact = Entity & { icon?: string; profession?: number };

// ---------- Fetch helpers ----------
function getLang(): string {
  if (typeof window === "undefined") return "FR";
  return localStorage.getItem("lang") || localStorage.getItem("dbChoice") || "FR";
}
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { "x-db-choice": getLang() } as any });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

// ---------- Data helpers ----------
const getCharImg = (c?: Character | null) => (c?.image ? c.image : "");
const getArayaImg = (a?: Arayashiki | null) => (a?.pic ? a.pic : "");
const getArtifactImg = (a?: Artifact | null) => (a?.icon ? a.icon : "");
const arayaOverlayUrl = (quality?: string) => (quality ? `/overlays/quality-${quality}.png` : "");
const eqId = (a: any, b: any) => String(a ?? "") === String(b ?? "");
const asNumber = (v: any): number => {
  if (v === null || v === undefined) return NaN;
  const x = typeof v === "string" ? v.trim() : v;
  const n = Number(x);
  return Number.isFinite(n) ? n : NaN;
};
function resolveName(e: any, fallback = ""): string {
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

// ---------- Rôles / Profession ----------
const normalize = (s?: string) =>
  (s || "").toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

const roleToProfession = (role?: any): number | null => {
  const n = asNumber(role);
  if (Number.isFinite(n) && n >= 1 && n <= 5) return n;
  const r = normalize((role ?? "").toString());
  if (r === "tank") return 1;
  if (r === "guerrier") return 2;
  if (r === "competence") return 3;
  if (r === "assassin") return 4;
  if (r === "support") return 5;
  return null;
};

const professionLabel = (profession?: number | null): string | null => {
  switch (profession ?? 0) {
    case 1:
      return "Tank";
    case 2:
      return "Guerrier";
    case 3:
      return "Compétence";
    case 4:
      return "Assassin";
    case 5:
      return "Support";
    default:
      return null;
  }
};

function canUseArtifact(character?: Character | null, artifact?: Artifact | null): boolean {
  if (!artifact) return false;
  const profNum = asNumber((artifact as any)?.profession);
  const prof = Number.isFinite(profNum) ? profNum : 0;
  if (!prof) return true;
  if (!character) return true;
  const code = roleToProfession((character as any)?.role);
  return code ? code === prof : false;
}
function filterArtifactsForCharacter(artifacts: Artifact[], character?: Character | null): Artifact[] {
  return artifacts.filter((a) => canUseArtifact(character, a));
}

// ---------- Filtrage Arayashiki par héros ----------
function parseParamToIdList(param?: string | null): string[] {
  const p = (param ?? "").trim();
  if (!p) return [];
  return p.split("|").map((s) => s.trim()).filter(Boolean);
}
function isArayaAllowedForHero(ar: Arayashiki, heroId: string | number): boolean {
  const ids = parseParamToIdList(ar?.param);
  if (ids.length === 0) return true;
  const hid = String(heroId).trim();
  return ids.includes(hid);
}
function filterArayasForHero(arayas: Arayashiki[], heroId: string | number | null | undefined): Arayashiki[] {
  if (heroId == null) return arayas;
  return arayas.filter((ar) => isArayaAllowedForHero(ar, heroId));
}

// ---------- UI primitives ----------
function Badge({ text }: { text: string }) {
  return (
    <div className="absolute left-1 top-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white/90">
      {text}
    </div>
  );
}

function SelectableSlot({
  filled,
  label,
  onClick,
  imageUrl,
  size = "md",
  badge,
  overlay,
  bordered = true,
  fill = false,
}: {
  filled: boolean;
  label?: string;
  onClick?: () => void;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  badge?: string;
  overlay?: React.ReactNode;
  bordered?: boolean;
  fill?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  const sizeClass = fill
    ? "w-full h-full"
    : size === "lg"
    ? "w-28 h-36 sm:w-32 sm:h-40 md:w-40 md:h-48"
    : size === "sm"
    ? "w-16 h-20"
    : "w-24 h-28 sm:w-28 sm:h-32";

  const showPlus = !imageUrl || errored;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative ${sizeClass} ${bordered ? "border border-white/15" : ""} rounded-none bg-white/5 hover:bg-white/10 transition-colors grid place-items-center overflow-hidden shadow-none focus:outline-none focus:ring-2 focus:ring-white/30`}
      aria-label={label || (filled ? "Modifier" : "Sélectionner")}
    >
      {badge ? <Badge text={badge} /> : null}
      {overlay ? <div className="pointer-events-none absolute inset-0 z-10">{overlay}</div> : null}
      {showPlus ? (
        <span className="text-2xl font-semibold select-none">+</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={label || "image"}
          className="w-full h-full object-contain p-2 bg-slate-900/40"
          onError={() => setErrored(true)}
        />
      )}
    </button>
  );
}

function VestigeSlot({
  vestige,
  onClick,
  size = 3,
  className = "",
}: {
  vestige: Vestige | null;
  onClick: () => void;
  size?: number;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-none border border-white/15 bg-white/5 hover:bg-white/10 grid place-items-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/30 ${className}`}
    >
      {!vestige?.pic ? (
        <div className="w-full h-full bg-slate-900/40" />
      ) : (
        <div className="w-full aspect-square overflow-hidden flex items-center justify-center">
          <div className="[&>canvas]:block [&>canvas]:w-full [&>canvas]:h-full [&>canvas]:max-w-full [&>canvas]:max-h-full [&>canvas]:object-contain">
            <IconCanvas
              prefix="sactx-0-2048x4096-ASTC 6x6-shenghen-"
              iconName={vestige.pic}
              jsonDir="/images/atlas/shenghen/"
              canvasId={`canvas-vestige-${vestige.id ?? "x"}`}
              imgHeight={4096}
              size={size}
            />
          </div>
        </div>
      )}
    </button>
  );
}

function GridSelectorModal<T extends Entity>({
  open,
  onClose,
  title,
  data,
  renderTile,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  data: T[];
  renderTile: (item: T) => { url?: string; label: string; extra?: React.ReactNode };
  onSelect: (item: T) => void;
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation("common");


  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const arr = Array.isArray(data) ? data : [];
    if (!s) return arr;
    return arr.filter((d) => resolveName(d, "").toLowerCase().includes(s));
  }, [q, data]);

  if (!open) return null;

  function Tile({ item }: { item: T }) {
    const [err, setErr] = useState(false);
    const { url, label, extra } = renderTile(item);
    return (
      <button
        onClick={() => onSelect(item)}
        className="group relative rounded-none border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        {url && !err ? (
          <img
            src={url}
            alt={label}
            className="w-full h-28 sm:h-32 object-contain p-2 bg-slate-900/40"
            onError={() => setErr(true)}
          />
        ) : (
          <div className="w-full h-28 sm:h-32 grid place-items-center text-white/40 text-sm">{t("teambuilder.noPreview")}</div>
        )}
        {extra ? <div className="pointer-events-none absolute inset-0 z-10">{extra}</div> : null}
        <div className="absolute inset-x-0 bottom-0 z-20 p-1.5 bg-gradient-to-t from-black/80 to-transparent text-[11px] text-white/90 pointer-events-none">
          {label}
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-x-0 top-8 mx-auto w-[min(1200px,94vw)] rounded-2xl bg-slate-950/95 border border-white/10 p-5 shadow-2xl">
        <header className="flex items-center justify-between gap-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-md bg-white/10 hover:bg-white/20">{t("teambuilder.close")}</button>
        </header>
        <div className="mt-3">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("teambuilder.search")}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 max-h-[75vh] overflow-y-auto pr-1">
          {list.map((item) => (
            <Tile key={String(item.id ?? resolveName(item, "?"))} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Helpers ----------
function sortCharactersLikeListing(a: any, b: any) {
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

// ---------- Formation (UI haut) ----------
function TeamFormation({
  characters,
  onPickCharacter,
  vestige,
  onPickVestige,
}: {
  characters: (Character | null)[];
  onPickCharacter: (slotIndex: number) => void;
  vestige: Vestige | null;
  onPickVestige: () => void;
}) {
  const [c1, c2, c3, c4, c5] = characters;
  const { t } = useTranslation("common");

  const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="inline-block shrink-0 border-animated-gradient">
      <div className="bg-[#0a091c]">{children}</div>
    </div>
  );

  return (
    <section className="relative mx-auto w-full max-w-4xl px-2">
      {/* Vestige */}
      <div className="absolute right-2 sm:right-4 md:right-6 top-1/2 translate-y-8 sm:translate-y-10 md:translate-y-12 z-10 text-right">
        <div className="text-[11px] sm:text-xs text-white/70 mb-1 sm:mb-1.5">{t("menu.Vestiges")}</div>
        <VestigeSlot
          vestige={vestige}
          onClick={onPickVestige}
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
          size={4}
        />
      </div>

      <div className="relative py-2">
        {/* rangée du fond (3-4-5) */}
        <div className="flex items-end justify-center gap-4 sm:gap-6 md:gap-8">
          <div className="translate-y-1">
            <Frame>
              <SelectableSlot bordered={false} size="lg" filled={!!c3} imageUrl={getCharImg(c3)} badge="3" onClick={() => onPickCharacter(2)} />
            </Frame>
          </div>
          <div className="-translate-y-1">
            <Frame>
              <SelectableSlot bordered={false} size="lg" filled={!!c4} imageUrl={getCharImg(c4)} badge="4" onClick={() => onPickCharacter(3)} />
            </Frame>
          </div>
          <div className="translate-y-1">
            <Frame>
              <SelectableSlot bordered={false} size="lg" filled={!!c5} imageUrl={getCharImg(c5)} badge="5" onClick={() => onPickCharacter(4)} />
            </Frame>
          </div>
        </div>

        {/* rangée de devant (1-2) */}
        <div className="mt-2 sm:mt-3 flex items-start justify-center gap-6 sm:gap-10 md:gap-12">
          <Frame>
            <SelectableSlot bordered={false} size="lg" filled={!!c1} imageUrl={getCharImg(c1)} badge="1" onClick={() => onPickCharacter(0)} />
          </Frame>
          <Frame>
            <SelectableSlot bordered={false} size="lg" filled={!!c2} imageUrl={getCharImg(c2)} badge="2" onClick={() => onPickCharacter(1)} />
          </Frame>
        </div>
      </div>
    </section>
  );
}

// ---------- Tableau (UI bas) ----------
function CharacterSetupGrid({
  selectedCharacters,
  setups,
  onPickArtifact,
  onPickAraya,
}: {
  selectedCharacters: (Character | null)[];
  setups: Record<string | number, { artifact: Artifact | null; arayas: (Arayashiki | null)[] }>;
  onPickArtifact: (characterId: string | number) => void;
  onPickAraya: (characterId: string | number, arayaIndex: number) => void;
}) {
  const { t } = useTranslation("common");

  return (
    <section className="mt-6 md:mt-8">
      <div className="border border-white/10 overflow-hidden">
        <div className="grid grid-cols-[1fr_24px_1fr_24px_1fr_1fr_1fr_1fr_1fr] gap-3 p-3 bg-white/5 text-white/70 text-[12px]">
          <div>{t("menu.Characters")}</div>
          <div></div>
          <div>{t("menu.Artefacts")}</div>
          <div></div>
          <div className="col-span-5">{t("menu.Arayashikis")}</div>
        </div>

        <div className="divide-y divide-white/10 bg-slate-900/30">
          {selectedCharacters.map((ch, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-[1fr_24px_1fr_24px_1fr_1fr_1fr_1fr_1fr] gap-3 p-3 items-center">
              {/* Personnage */}
              <div className="aspect-[4/5]">
                <div className="w-full h-full relative border-gradient-1">
                  <div className="w-full h-full bg-[#0a091c]">
                    <SelectableSlot bordered={false} filled={!!ch} imageUrl={getCharImg(ch || undefined)} fill size="sm" />
                  </div>
                </div>
              </div>

              <div />
              {/* Artefact */}
              <div className="aspect-[4/5]">
                {ch ? (
                  <SelectableSlot
                    filled={!!setups[(ch as any).id]?.artifact}
                    imageUrl={getArtifactImg(setups[(ch as any).id]?.artifact)}
                    fill
                    size="sm"
                    onClick={() => onPickArtifact((ch as any).id)}
                  />
                ) : (
                  <div className="text-white/40 text-xs">—</div>
                )}
              </div>

              <div />
              {/* Arayas */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-[4/5]">
                  {ch ? (
                    <SelectableSlot
                      filled={!!setups[(ch as any).id]?.arayas?.[i]}
                      imageUrl={getArayaImg(setups[(ch as any).id]?.arayas?.[i])}
                      fill
                      size="sm"
                      overlay={(() => {
                        const q = setups[(ch as any).id]?.arayas?.[i]?.quality as string | undefined;
                        const url = arayaOverlayUrl(q);
                        return url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={url} alt="quality overlay" className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none" />
                        ) : null;
                      })()}
                      onClick={() => onPickAraya((ch as any).id, i)}
                    />
                  ) : (
                    <div className="text-white/40 text-xs">—</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Stockage courant + configs multiples ----------
const STORAGE_KEY = "ssloj_team_builder_v1";
const STORAGE_KEY_CONFIGS = "ssloj_team_builder_configs_v1";

type SavedConfig = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  team: (string | number | null)[];
  vestigeId: string | number | null;
  setups: Record<string | number, { artifactId: string | number | null; arayaIds: (string | number | null)[] }>;
};

// ---------- Page ----------
export default function TeamBuilder() {
  // État courant
  const [team, setTeam] = useState<(Character | null)[]>([null, null, null, null, null]);
  const [vestige, setVestige] = useState<Vestige | null>(null);
  const [setups, setSetups] = useState<Record<string | number, { artifact: Artifact | null; arayas: (Arayashiki | null)[] }>>({});
  const [teamName, setTeamName] = useState<string>("");

  // Configs locales
  const [configs, setConfigs] = useState<SavedConfig[]>([]);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [arayas, setArayas] = useState<Arayashiki[]>([]);
  const [vestiges, setVestiges] = useState<Vestige[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const { t } = useTranslation("common");

  const [modal, setModal] = useState<
    | { kind: "character"; slot: number }
    | { kind: "vestige" }
    | { kind: "artifact"; characterId: string | number }
    | { kind: "araya"; characterId: string | number; idx: number }
    | null
  >(null);

  const exportRef = useRef<HTMLDivElement>(null);

  // Load état courant
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data?.team) setTeam(data.team);
      if (data?.vestige !== undefined) setVestige(data.vestige);
      if (data?.setups) setSetups(data.setups);
      if (typeof data?.teamName === "string") setTeamName(data.teamName);
    } catch {}
  }, []);

  // Save état courant
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ team, vestige, setups, teamName }));
    } catch {}
  }, [team, vestige, setups, teamName]);

  // Load/Save configs multiples
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONFIGS);
      if (raw) setConfigs(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIGS, JSON.stringify(configs));
    } catch {}
  }, [configs]);

  // Fetch data
  useEffect(() => {
    (async () => {
      try {
        const [chs, ars, ves, arts] = await Promise.all([
          fetchJSON<Character[]>(DATA_SOURCES.characters),
          fetchJSON<Arayashiki[]>(DATA_SOURCES.arayashikis),
          fetchJSON<Vestige[]>(DATA_SOURCES.vestiges),
          fetchJSON<Artifact[]>(DATA_SOURCES.artifacts),
        ]);
        setCharacters(chs || []);
        setArayas(ars || []);
        setVestiges(ves || []);
        setArtifacts(arts || []);
      } catch (e) {
        console.error("[TeamBuilder] fetch error", e);
      }
    })();
  }, []);

  const charactersSorted = useMemo(() => [...characters].sort(sortCharactersLikeListing), [characters]);

  // ---------- Ouverture modales ----------
  const openCharacterModal = (slot: number) => setModal({ kind: "character", slot });
  const openVestigeModal = () => setModal({ kind: "vestige" });
  const openArtifactModal = (characterId: string | number) => setModal({ kind: "artifact", characterId });
  const openArayaModal = (characterId: string | number, idx: number) => setModal({ kind: "araya", characterId, idx });

  // ---------- Anti-doublons ----------
  const selectedCharacterIds = useMemo(
    () => new Set(team.filter(Boolean).map((ch) => String((ch as any).id))),
    [team]
  );

  // Personnages : liste sans doublons
  const characterModalData = useMemo(() => {
    const ids = new Set(selectedCharacterIds);
    if (modal?.kind === "character") {
      const currentId = team[modal.slot]?.id as any;
      if (currentId) ids.delete(String(currentId));
    }
    return [...charactersSorted].filter((c: any) => !ids.has(String(c.id))).reverse();
  }, [charactersSorted, selectedCharacterIds, modal, team]);

  // Arayas : sans doublons pour CE perso + filtre compatibilité
  const arayaModalData = useMemo(() => {
    if (modal?.kind !== "araya") return [...arayas].reverse();
    const { characterId, idx } = modal as any;

    const currentSet = new Set(
      (setups[characterId]?.arayas || [])
        .map((a) => (a as any)?.id)
        .filter(Boolean)
        .map((id) => String(id))
    );
    const currentAtIdx = (setups[characterId]?.arayas || [])[idx]?.id as any;
    if (currentAtIdx) currentSet.delete(String(currentAtIdx));

    const deduped = [...arayas].filter((a: any) => !currentSet.has(String(a.id)));
    const filteredByHero = filterArayasForHero(deduped as Arayashiki[], characterId);

    return filteredByHero.reverse();
  }, [arayas, setups, modal]);

  // Artefacts : filtrage par compatibilité de classe
  const artifactModalData = useMemo(() => {
    if (modal?.kind !== "artifact") return artifacts;
    const { characterId } = modal as any;
    const char =
      team.find((c) => eqId((c as any)?.id, characterId)) ||
      characters.find((c) => eqId((c as any).id, characterId));
    return filterArtifactsForCharacter(artifacts, char);
  }, [modal, artifacts, team, characters]);

  // ---------- Sélection ----------
  const onSelectCharacter = (ch: Character) => {
    if (modal?.kind !== "character") return;
    const { slot } = modal;

    if (team.some((t, i) => i !== slot && eqId((t as any)?.id, (ch as any).id))) {
      setModal(null);
      return;
    }

    setTeam((prev) => {
      const copy = prev.slice();
      copy[slot] = ch;
      return copy;
    });
    setSetups((prev) => ({
      ...prev,
      [(ch as any).id]: prev[(ch as any).id] ?? { artifact: null, arayas: Array(5).fill(null) },
    }));
    setModal(null);
  };

  const onSelectVestige = (v: Vestige) => {
    setVestige(v);
    setModal(null);
  };

  const onSelectArtifact = (a: Artifact) => {
    if (modal?.kind !== "artifact") return;
    const id = (modal as any).characterId;
    const char =
      team.find((c) => eqId((c as any)?.id, id)) ||
      characters.find((c) => eqId((c as any).id, id));
    if (!canUseArtifact(char || undefined, a)) {
      alert("Cet artefact est limité à une autre classe.");
      return;
    }
    setSetups((prev) => ({ ...prev, [id]: { ...(prev[id] || { arayas: Array(5).fill(null) }), artifact: a } }));
    setModal(null);
  };

  const onSelectAraya = (ar: Arayashiki) => {
    if (modal?.kind !== "araya") return;
    const { characterId: id, idx } = modal as any;

    if (!isArayaAllowedForHero(ar, id)) {
      alert("Cette carte Arayashiki n'est pas compatible avec ce personnage.");
      return;
    }

    const already = (setups[id]?.arayas || []).some((x, i) => eqId(x?.id, (ar as any).id) && i !== idx);
    if (already) {
      setModal(null);
      return;
    }

    setSetups((prev) => {
      const current = prev[id] || { artifact: null, arayas: Array(5).fill(null) };
      const next = [...current.arayas];
      next[idx] = ar;
      return { ...prev, [id]: { ...current, arayas: next } };
    });
    setModal(null);
  };

  // ---------- EXPORT CANVAS ----------
  async function drawTeamToCanvas(
    canvas: HTMLCanvasElement,
    {
      team: charactersSel,
      setups: setupsSel,
      vestige: vestigeSel,
      teamName,
    }: {
      team: (Character | null)[];
      setups: Record<string | number, { artifact: Artifact | null; arayas: (Arayashiki | null)[] }>;
      vestige: Vestige | null;
      teamName: string;
    }
  ) {
    const W = 1080;
    const H = 1920;
    const P = 80;
    const CONTENT_SHIFT_Y = 80;
    const ARAYA_IMG_INSET = 12;
    const ARAYA_OVERLAY_INSET = 2;

    const loadImage = (src?: string | null): Promise<HTMLImageElement | null> =>
      new Promise((resolve) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    const drawContain = (
      ctx: CanvasRenderingContext2D,
      img: CanvasImageSource,
      x: number, y: number, w: number, h: number
    ) => {
      const iw = (img as any).naturalWidth || (img as any).width || 1;
      const ih = (img as any).naturalHeight || (img as any).height || 1;
      const r = Math.min(w / iw, h / ih);
      const rw = iw * r;
      const rh = ih * r;
      const dx = x + (w - rw) / 2;
      const dy = y + (h - rh) / 2;
      const prev = (ctx as any).imageSmoothingEnabled;
      (ctx as any).imageSmoothingEnabled = true;
      ctx.drawImage(img as any, dx, dy, rw, rh);
      (ctx as any).imageSmoothingEnabled = prev;
    };

    const strokeGradientRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, lw = 1) => {
      const g = ctx.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0.0, "#7aa7ff");
      g.addColorStop(0.33, "#c9d2ff");
      g.addColorStop(0.66, "#e9b4ff");
      g.addColorStop(1.0, "#a1b8ff");
      ctx.strokeStyle = g;
      ctx.lineWidth = lw;
      ctx.strokeRect(x + lw / 2, y + lw / 2, w - lw, h - lw);
    };

    const strokeSolidRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color = "#93a4c6", lw = 1) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.strokeRect(x + lw / 2, y + lw / 2, w - lw, h - lw);
    };

    type CellBorder = "gradient" | "solid" | "none";
    const drawClippedCell = async (
      ctx: CanvasRenderingContext2D,
      imgUrl: string | undefined,
      overlayUrl: string | undefined,
      x: number, y: number, w: number, h: number,
      opts?: { pad?: number; border?: CellBorder; imgInset?: number; overlayInset?: number; borderWidth?: number }
    ) => {
      const pad = opts?.pad ?? 8;
      const lw = opts?.borderWidth ?? 1;

      if (opts?.border === "gradient") strokeGradientRect(ctx, x, y, w, h, lw);
      else if (opts?.border === "solid") strokeSolidRect(ctx, x, y, w, h, "#454d5eff", lw);

      const innerX = x + pad;
      const innerY = y + pad;
      const innerW = w - pad * 2;
      const innerH = h - pad * 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(innerX, innerY, innerW, innerH);
      ctx.clip();

      const imgInset = opts?.imgInset ?? 0;
      const imgX = innerX + imgInset;
      const imgY = innerY + imgInset;
      const imgW = innerW - imgInset * 2;
      const imgH = innerH - imgInset * 2;

      const img = await loadImage(imgUrl);
      if (img) drawContain(ctx, img, imgX, imgY, imgW, imgH);

      if (overlayUrl) {
        const ovInset = opts?.overlayInset ?? 0;
        const ovX = innerX + ovInset;
        const ovY = innerY + ovInset;
        const ovW = innerW - ovInset * 2;
        const ovH = innerH - ovInset * 2;

        const ov = await loadImage(overlayUrl);
        if (ov) drawContain(ctx, ov, ovX, ovY, ovW, ovH);
      }

      ctx.restore();
    };

    // -- dimensions + contexte
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0e1630");
    bg.addColorStop(1, "#0b1126");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Title
    const TITLE_TOP = P;
    const titleText = (teamName?.trim() || "Ma team").trim();
    ctx.font = '400 64px "Times New Roman", Georgia, serif';
    const tm = ctx.measureText(titleText);
    const titleH =
      (tm as any).actualBoundingBoxAscent && (tm as any).actualBoundingBoxDescent
        ? (tm as any).actualBoundingBoxAscent + (tm as any).actualBoundingBoxDescent
        : 64;
    const titleX = (W - tm.width) / 2;
    const titleY = TITLE_TOP;
    const titleGrad = ctx.createLinearGradient(titleX, titleY, titleX + tm.width, titleY + 60);
    titleGrad.addColorStop(0, "#f5cd76");
    titleGrad.addColorStop(0.5, "#ffe08a");
    titleGrad.addColorStop(1, "#d3a64a");
    ctx.fillStyle = titleGrad;
    ctx.textBaseline = "top";
    ctx.fillText(titleText, titleX, titleY);

    const TITLE_BLOCK_BOTTOM = titleY + titleH + 28;

    // Metrics
    const slotW = 200, slotH = 240;
    const colGapBack = 24, colGapFront = 56;
    const formationHeight = slotH * 2 + 60;
    const verticalGapRows = 60;
    const rowH = 160, spacer = 16, cellGap = 8;
    const gapBetweenFormationAndTable = 60;

    const SIG_MARGIN = 32;
    ctx.font = "500 18px Inter, system-ui, -apple-system, Segoe UI, Roboto";
    const signH = 18;

    const contentHeight = formationHeight + gapBetweenFormationAndTable + rowH * 5 + 16 * 4;
    const availableTop = TITLE_BLOCK_BOTTOM;
    const availableBottom = H - (P + signH) - SIG_MARGIN;
    const contentStartY = availableTop + Math.max(0, (availableBottom - availableTop - contentHeight) / 2);

    // Décalage contenu
    ctx.save();
    ctx.translate(0, CONTENT_SHIFT_Y);

    // Formation
    const centerX = W / 2;
    let y = contentStartY;
    const rowBackY  = y + verticalGapRows / 2;
    const rowFrontY = rowBackY + slotH + verticalGapRows / 2;

    const drawCharacterSlot = async (ch: any, cx: number, cy: number, badge: string) => {
      const x = cx - slotW / 2;
      const y = cy - slotH / 2;
      await drawClippedCell(ctx, getCharImg(ch), undefined, x, y, slotW, slotH, { pad: 8, border: "gradient", borderWidth: 1 });
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(x + 8, y + 8, 28, 22);
      ctx.fillStyle = "#fff";
      ctx.font = "600 13px Inter, system-ui, -apple-system, Segoe UI, Roboto";
      ctx.fillText(badge, x + 16, y + 10);
    };

    await drawCharacterSlot(charactersSel[2], centerX - (slotW + colGapBack), rowBackY + 8, "3");
    await drawCharacterSlot(charactersSel[3], centerX,                           rowBackY - 8, "4");
    await drawCharacterSlot(charactersSel[4], centerX + (slotW + colGapBack),    rowBackY + 8, "5");
    await drawCharacterSlot(charactersSel[0], centerX - (slotW + colGapFront) / 2.2, rowFrontY, "1");
    await drawCharacterSlot(charactersSel[1], centerX + (slotW + colGapFront) / 2.2, rowFrontY, "2");

    // Vestige
    if (vestigeSel?.id) {
      const vCanvas = document.getElementById(`canvas-vestige-${vestigeSel.id}`) as HTMLCanvasElement | null;
      if (vCanvas) {
        const vSize = 150;
        const vx = W - P - vSize;
        const vy = rowFrontY + slotH / 2 - vSize;
        ctx.fillStyle = "#B0B7C3";
        ctx.font = "600 16px Inter, system-ui, -apple-system, Segoe UI, Roboto";
        ctx.fillText("Vestige", vx - 4, vy - 28);
        drawContain(ctx, vCanvas as any, vx, vy, vSize, vSize);
      }
    }

    // Tableau
    y = rowFrontY + slotH / 2 + gapBetweenFormationAndTable;
    const tableLeft = P, tableRight = W - P;
    const tableWidth = tableRight - tableLeft;

    const totalCols = 9;
    const innerGaps = cellGap * (totalCols - 1);
    const fixedSpace = spacer * 2;
    const available = tableWidth - innerGaps - fixedSpace;
    const fr = available / 7;
    const colW = { char: fr, art: fr, araya: fr } as const;

    const drawSolidCell = async (imgUrl?: string, overlayUrl?: string, x?: number, y?: number, w?: number, h?: number) => {
      await drawClippedCell(ctx, imgUrl, overlayUrl, x!, y!, w!, h!, { pad: 8, border: "solid", borderWidth: 1 });
    };

    let ry = y;
    for (let r = 0; r < charactersSel.length; r++) {
      const ch = charactersSel[r];
      let x = tableLeft;

      await drawClippedCell(ctx, getCharImg(ch || undefined), undefined, x, ry, colW.char, rowH, { pad: 8, border: "gradient", borderWidth: 1 });

      x += colW.char + cellGap + spacer + cellGap;

      const art = ch ? setupsSel[(ch as any).id]?.artifact : null;
      await drawSolidCell(getArtifactImg(art || undefined), undefined, x, ry, colW.art, rowH);

      x += colW.art + cellGap + spacer + cellGap;

      for (let i = 0; i < 5; i++) {
        const araya = ch ? setupsSel[(ch as any).id]?.arayas?.[i] : null;
        const imgUrl = getArayaImg(araya || undefined);
        const ovUrl = araya ? `/overlays/quality-${(araya as any).quality}.png` : undefined;
        await drawClippedCell(ctx, imgUrl, ovUrl, x, ry, colW.araya, rowH, {
          pad: 8, border: "solid", borderWidth: 1, imgInset: ARAYA_IMG_INSET, overlayInset: ARAYA_OVERLAY_INSET,
        });
        x += colW.araya + cellGap;
      }

      ry += rowH + 16;
    }

    ctx.restore();

    // Signature
    ctx.fillStyle = "#9aa3af";
    ctx.font = "500 18px Inter, system-ui, -apple-system, Segoe UI, Roboto";
    const sw = ctx.measureText("généré par https://ssloj.com").width;
    ctx.fillText("généré par https://ssloj.com", (W - sw) / 2, H - P - 18);
  }

  const doExport = async () => {
    const canvas = document.createElement("canvas");
    await drawTeamToCanvas(canvas, { team, setups, vestige, teamName });
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `ssloj-team-mobile-${Date.now()}.png`;
    a.click();
  };

  const resetAll = () => {
    setTeam([null, null, null, null, null]);
    setVestige(null);
    setSetups({});
    setTeamName("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  async function exportAsPngBlob(): Promise<Blob> {
    const canvas = document.createElement("canvas");
    await drawTeamToCanvas(canvas, { team, setups, vestige, teamName });
    return await new Promise((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png")
    );
  }

  async function shareImage() {
    try {
      const blob = await exportAsPngBlob();
      const file = new File([blob], "ssloj-team.png", { type: "image/png" });
      // @ts-ignore
      const canShareFiles = !!navigator.canShare && navigator.canShare({ files: [file] });
      // @ts-ignore
      if (navigator.share && canShareFiles) {
        // @ts-ignore
        await navigator.share({
          title: "Ma Team SSLOJ",
          text: "Partagé depuis le Team Builder",
          files: [file],
        });
        return;
      }
      if (navigator.clipboard && "write" in navigator.clipboard && window.ClipboardItem) {
        // @ts-ignore
        const item = new ClipboardItem({ "image/png": blob });
        // @ts-ignore
        await navigator.clipboard.write([item]);
        alert("Image copiée dans le presse-papiers ! Ouvre Discord et colle (Ctrl/⌘+V).");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ssloj-team.png";
      a.click();
      URL.revokeObjectURL(url);
      alert("Image téléchargée. Glisse-dépose dans Discord.");
    } catch {
      // ignore
    }
  }

  // ---------- Helpers Configs ----------
  function byId<T extends Entity>(arr: T[], id: string | number | null | undefined): T | null {
    if (id == null) return null;
    return arr.find((x) => eqId(x?.id, id)) ?? null;
  }

  function serializeCurrentToSaved(name: string): SavedConfig {
    const teamIds = team.map((ch) => (ch as any)?.id ?? null);
    const vestigeId = (vestige as any)?.id ?? null;
    const setupsIds: SavedConfig["setups"] = {};
    Object.entries(setups).forEach(([chId, cfg]) => {
      setupsIds[chId] = {
        artifactId: (cfg.artifact as any)?.id ?? null,
        arayaIds: (cfg.arayas || []).map((a) => (a as any)?.id ?? null),
      };
    });
    const now = Date.now();
    return {
      id: String(now),
      name: name?.trim() || "Ma team",
      createdAt: now,
      updatedAt: now,
      team: teamIds,
      vestigeId,
      setups: setupsIds,
    };
  }

  function applySavedConfig(cfg: SavedConfig) {
    const nextTeam = (cfg.team || []).slice(0, 5).map((id) => byId(characters, id)) as (Character | null)[];
    while (nextTeam.length < 5) nextTeam.push(null);
    const nextVestige = byId(vestiges, cfg.vestigeId) as Vestige | null;

    const nextSetups: typeof setups = {};
    Object.entries(cfg.setups || {}).forEach(([chId, s]) => {
      const art = byId(artifacts, s.artifactId) as Artifact | null;
      const arayasList = (s.arayaIds || []).map((aid) => byId(arayas, aid)) as (Arayashiki | null)[];
      while (arayasList.length < 5) arayasList.push(null);
      nextSetups[chId] = { artifact: art, arayas: arayasList };
    });

    setTeam(nextTeam);
    setVestige(nextVestige);
    setSetups(nextSetups);
    setTeamName(cfg.name || "");
  }

  function saveNewConfig() {
    const name = (teamName || "").trim() || "Ma team";
    const draft = serializeCurrentToSaved(name);
    setConfigs((prev) => [draft, ...prev].slice(0, 200));
  }

  function deleteConfig(id: string) {
    setConfigs((prev) => prev.filter((c) => c.id !== id));
  }

  function loadConfig(id: string) {
    const cfg = configs.find((c) => c.id === id);
    if (!cfg) return;
    applySavedConfig(cfg);
  }

  // Rendu miniatures d'une config (utilise les IDs stockés)
  const renderConfigThumbs = (cfg: SavedConfig) => {
    const ids = (cfg.team || []).slice(0, 5);
    return (
      <div className="flex items-center gap-1.5">
        {ids.map((cid, i) => {
          const ch = byId(characters, cid);
          const url = getCharImg(ch || undefined);
          return url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={resolveName(ch, `Slot ${i + 1}`)}
              className="h-15 w-7 object-contain rounded-[2px] bg-slate-900/50 border border-white/10"
            />
          ) : (
            <div
              key={i}
              className="h-15 w-7 rounded-[2px] bg-white/5 border border-white/10"
              title="vide"
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <div id="export-root" className="relative mx-auto max-w-6xl p-4 md:p-6 space-y-4 bg-[#0f172a]" ref={exportRef}>
        <h1 className="text-2xl font-semibold tracking-tight">TEAM BUILDER</h1>

        {/* --- Liste des configurations enregistrées (haut) --- */}
        {configs.length > 0 ? (
          <div className="border border-white/10">
            <div className="bg-white/5 px-3 py-2 text-[12px] text-white/70">Configurations</div>
            <div className="divide-y divide-white/10">
              {configs.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-2 px-3 py-2">
                  <button
                    onClick={() => loadConfig(c.id)}
                    className="flex items-center gap-3 hover:underline"
                    title="Charger cette configuration"
                  >
                    <span className="text-sm">{c.name}</span>
                    {renderConfigThumbs(c)}
                  </button>
                  <button
                    onClick={() => deleteConfig(c.id)}
                    className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20"
                    title={t("teambuilder.delete")}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Nom de la team (sert de nom à la sauvegarde) */}
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30"
          placeholder={t("teambuilder.teamName")}
        />

        <TeamFormation
          characters={team}
          vestige={vestige}
          onPickVestige={openVestigeModal}
          onPickCharacter={openCharacterModal}
        />

        <CharacterSetupGrid
          selectedCharacters={team}
          setups={setups}
          onPickArtifact={openArtifactModal}
          onPickAraya={openArayaModal}
        />

        {/* Boutons bas de page : Reset / Export / Partager / Sauvegarder */}
        <div className="pt-2 md:pt-3 flex flex-wrap items-center justify-end gap-2">
          <button onClick={resetAll} className="px-3 py-2 bg-white/5 hover:bg-white/15 border border-white/10 text-red-200" title={t("teambuilder.init")}>{t("teambuilder.init")}</button>
          <button onClick={doExport} className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10">{t("teambuilder.export")}</button>
          <button onClick={shareImage} className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10">{t("teambuilder.share")}</button>
          <button
            onClick={saveNewConfig}
            className="px-3 py-2 bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-700/40 rounded-md"
            title="Sauvegarder l'état courant comme nouvelle configuration"
          >
            {t("teambuilder.save")}
          </button>
        </div>
      </div>

      {/* Modales */}
      <GridSelectorModal
        open={modal?.kind === "character"}
        onClose={() => setModal(null)}
        title={t("teambuilder.selectCharacter")}
        data={charactersSorted}
        renderTile={(c: any) => ({ url: getCharImg(c), label: resolveName(c, "") })}
        onSelect={(c) => onSelectCharacter(c as Character)}
      />

      <GridSelectorModal
        open={modal?.kind === "vestige"}
        onClose={() => setModal(null)}
        title={t("teambuilder.selectSage")}
        data={vestiges}
        renderTile={(v: any) => ({
          url: "",
          label: resolveName(v, ""),
          extra: v?.pic ? (
            <div className="absolute inset-0 p-2 bg-slate-900/40 overflow-hidden [&>canvas]:block [&>canvas]:w-full [&>canvas]:h-full [&>canvas]:max-w-full [&>canvas]:max-h-full [&>canvas]:object-contain">
              <IconCanvas
                prefix="sactx-0-2048x4096-ASTC 6x6-shenghen-"
                iconName={v.pic}
                jsonDir="/images/atlas/shenghen/"
                canvasId={`canvas-vestige-modal-${v.id ?? Math.random()}`}
                imgHeight={4096}
                size={4}
              />
            </div>
          ) : undefined,
        })}
        onSelect={(v) => { setVestige(v as Vestige); setModal(null); }}
      />

      <GridSelectorModal
        open={modal?.kind === "artifact"}
        onClose={() => setModal(null)}
        title={t("teambuilder.selectArtefact")}
        data={(() => {
          if (modal?.kind !== "artifact") return artifacts;
          const { characterId } = modal as any;
          const char =
            team.find((c) => eqId((c as any)?.id, characterId)) ||
            characters.find((c) => eqId((c as any).id, characterId));
          return filterArtifactsForCharacter(artifacts, char);
        })()}
        renderTile={(a: any) => ({
          url: getArtifactImg(a),
          label: resolveName(a, ""),
          extra: (() => {
            const lab = professionLabel(Number(a?.profession || 0));
            return lab ? (
              <div className="absolute left-1 top-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white/90">{lab} only</div>
            ) : null;
          })(),
        })}
        onSelect={(a) => onSelectArtifact(a as Artifact)}
      />

      <GridSelectorModal
        open={modal?.kind === "araya"}
        onClose={() => setModal(null)}
        title={t("teambuilder.selectAraya")}
        data={arayaModalData}
        renderTile={(a: any) => ({
          url: getArayaImg(a),
          label: resolveName(a, ""),
          extra: a?.quality ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={arayaOverlayUrl(a.quality)} alt="quality overlay" className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none" />
          ) : undefined,
        })}
        onSelect={(a) => onSelectAraya(a as Arayashiki)}
      />

      {/* --- CSS additionnel pour la bordure dégradée 1px --- */}
      <style jsx global>{`
        .border-gradient-1 { position: relative; }
        .border-gradient-1::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          background: linear-gradient(135deg, #7aa7ff, #c9d2ff 40%, #e9b4ff 70%, #a1b8ff);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "next-i18next";

import "@/styles/gradient-border.css";

import { DATA_SOURCES, fetchJSON } from "@/lib/teambuilder/data";
import {
  Character,
  Arayashiki,
  Vestige,
  Artifact,
  Entity,
} from "@/lib/teambuilder/types";

// Temporary SavedConfig type definition (move to types file if needed)
type SavedConfig = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  team: (string | number | null)[];
  vestigeId: string | number | null;
  setups: Record<
    string | number,
    {
      artifactId: string | number | null;
      arayaIds: (string | number | null)[];
    }
  >;
};

import {
  sortCharactersLikeListing,
  resolveName,
  arayaOverlayUrl,
  getCharImg,
  getArayaImg,
  getArtifactImg,
  filterArtifactsForCharacter,
  filterArayasForHero,
  canUseArtifact,
  eqId,
  buildSharableState,   // (state) -> objet encodable
  parseSharableState,   // (obj) -> { team, vestigeId, setups, teamName }
} from "@/lib/teambuilder/filters";

import TeamFormation from "@/components/teambuilder/TeamFormation";
import CharacterSetupGrid from "@/components/teambuilder/CharacterSetupGrid";
import GridSelectorModal from "@/components/teambuilder/GridSelectorModal";

import useExportCanvas from "@/hooks/useExportCanvas";

// ===========================
// Store / clés localStorage
// ===========================
const STORAGE_KEY = "ssloj_team_builder_v1";
const STORAGE_KEY_CONFIGS = "ssloj_team_builder_configs_v1";

// util swap
const swap = <T,>(arr: T[], i: number, j: number): T[] => {
  if (i === j) return arr.slice();
  const copy = arr.slice();
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
};

// ===========================
// Page
// ===========================
export default function TeamBuilderPage() {
  const { t } = useTranslation("common");
  const searchParams = useSearchParams();

  // --- états principaux ---
  const [team, setTeam] = useState<(Character | null)[]>([null, null, null, null, null]);
  const [vestige, setVestige] = useState<Vestige | null>(null);
  const [setups, setSetups] = useState<
    Record<string | number, { artifact: Artifact | null; arayas: (Arayashiki | null)[] }>
  >({});
  const [teamName, setTeamName] = useState<string>("");

  // lecture seule via ?ro=1
  const [readOnly, setReadOnly] = useState<boolean>(false);

  // configs locales
  const [configs, setConfigs] = useState<SavedConfig[]>([]);

  // datasets
  const [characters, setCharacters] = useState<Character[]>([]);
  const [arayas, setArayas] = useState<Arayashiki[]>([]);
  const [vestiges, setVestiges] = useState<Vestige[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);

  // cache détails Araya
  const [arayaDetails, setArayaDetails] = useState<Record<string, Partial<Arayashiki>>>({});

  const exportRef = useRef<HTMLDivElement>(null);

  // Export (image)
  const { exporting, exportAsDataURL, exportAsBlob } = useExportCanvas();

  // --------------------
  // Chargement datasets
  // --------------------
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

  // --------------------
  // Helper: charge un détail araya si manquant (condition/param)
  // --------------------
  async function ensureArayaDetail(id: string | number) {
    const key = String(id);
    const existing = arayaDetails[key];
    if (existing && ("condition" in existing || "param" in existing)) return;

    try {
      const detail = await fetchJSON<Partial<Arayashiki>>(`/api/arayashikis/${key}`);
      setArayaDetails((prev) => ({ ...prev, [key]: detail || {} }));
    } catch (e) {
      setArayaDetails((prev) => ({ ...prev, [key]: {} }));
      console.warn("[TeamBuilder] araya detail fetch error for", key, e);
    }
  }

  // --------------------
  // Charger compo depuis l’URL (?comp=base64, ?ro=1)
  // --------------------
  useEffect(() => {
    const comp = searchParams?.get("comp");
    const ro = searchParams?.get("ro");
    if (!comp) {
      setReadOnly(ro === "1");
      return;
    }

    try {
      let decoded;
      try {
        decoded = JSON.parse(atob(comp));
      } catch (e) {
        console.warn("Invalid base64 in comp param", e);
        setReadOnly(ro === "1");
        return;
      }
      const parsed = parseSharableState(decoded);

      const byId = <T extends Entity>(arr: T[], id: any): T | null =>
        id == null ? null : (arr.find((x) => eqId(x?.id, id)) ?? null);

      const nextTeam = (parsed.team || [])
        .slice(0, 5)
        .map((id: any) => byId(characters, id)) as (Character | null)[];
      while (nextTeam.length < 5) nextTeam.push(null);

      const nextVestige = byId(vestiges, parsed.vestigeId) as Vestige | null;

      const nextSetups: typeof setups = {};
      Object.entries(parsed.setups || {}).forEach(([chId, s]: any) => {
        const art = byId(artifacts, s?.artifactId) as Artifact | null;
        const arayasList = (s?.arayaIds || []).map((aid: any) => byId(arayas, aid)) as (Arayashiki | null)[];
        while (arayasList.length < 5) arayasList.push(null);
        nextSetups[chId] = { artifact: art, arayas: arayasList };
      });

      setTeam(nextTeam);
      setVestige(nextVestige);
      setSetups(nextSetups);
      setTeamName(parsed.teamName || "");

      setReadOnly(ro === "1");
    } catch {
      console.warn("Invalid comp param");
      setReadOnly(ro === "1");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, characters, vestiges, artifacts, arayas]);

  // --------------------
  // LocalStorage (état courant)
  // --------------------
  useEffect(() => {
    if (readOnly) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data?.team) setTeam(data.team);
      if (data?.vestige !== undefined) setVestige(data.vestige);
      if (data?.setups) setSetups(data.setups);
      if (typeof data?.teamName === "string") setTeamName(data.teamName);
    } catch {}
  }, [readOnly]);

  useEffect(() => {
    if (readOnly) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ team, vestige, setups, teamName }));
    } catch {}
  }, [team, vestige, setups, teamName, readOnly]);

  // --------------------
  // LocalStorage (configs multiples)
  // --------------------
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

  // --------------------
  // Helpers Configs
  // --------------------
  const byId = <T extends Entity>(arr: T[], id: string | number | null | undefined): T | null => {
    if (id == null) return null;
    return arr.find((x) => eqId(x?.id, id)) ?? null;
  };

  const serializeCurrentToSaved = (name: string): SavedConfig => {
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
  };

  function applySavedConfig(cfg: SavedConfig) {
    const nextTeam = (cfg.team || []).slice(0, 5).map((id) => byId(characters, id)) as (Character | null)[];
    while (nextTeam.length < 5) nextTeam.push(null);
    const nextVestige = byId(vestiges, cfg.vestigeId) as Vestige | null;

    const nextSetups: typeof setups = {};
    Object.entries(cfg.setups || {}).forEach(([chId, s]) => {
      const art = byId(artifacts, (s as any).artifactId) as Artifact | null;
      const arayasList = ((s as any).arayaIds || []).map((aid: any) => byId(arayas, aid)) as (Arayashiki | null)[];
      while (arayasList.length < 5) arayasList.push(null);
      nextSetups[chId] = { artifact: art, arayas: arayasList };
    });

    setTeam(nextTeam);
    setVestige(nextVestige);
    setSetups(nextSetups);
    setTeamName(cfg.name || "");
  }

  function saveNewConfig() {
    if (readOnly) return;
    const name = (teamName || "").trim() || "Ma team";
    const draft = serializeCurrentToSaved(name);
    setConfigs((prev) => [draft, ...prev].slice(0, 200));
  }

  function deleteConfig(id: string) {
    if (readOnly) return;
    setConfigs((prev) => prev.filter((c) => c.id !== id));
  }

  function loadConfig(id: string) {
    const cfg = configs.find((c) => c.id === id);
    if (!cfg) return;
    applySavedConfig(cfg);
  }

  // --------------------
  // Modales
  // --------------------
  const [modal, setModal] = useState<
    | { kind: "character"; slot: number }
    | { kind: "vestige" }
    | { kind: "artifact"; characterId: string | number }
    | { kind: "araya"; characterId: string | number; idx: number }
    | null
  >(null);

  const openCharacterModal = (slot: number) => setModal({ kind: "character", slot });
  const openVestigeModal = () => setModal({ kind: "vestige" });
  const openArtifactModal = (characterId: string | number) => setModal({ kind: "artifact", characterId });
  const openArayaModal = (characterId: string | number, idx: number) =>
    setModal({ kind: "araya", characterId, idx });

  // Précharge détails Araya quand la modale s’ouvre
  useEffect(() => {
    if (modal?.kind !== "araya") return;

    const missingIds = arayas
      .filter(
        (a: any) =>
          a &&
          a.id != null &&
          (a.condition === undefined && a.param === undefined) &&
          arayaDetails[String(a.id)] === undefined
      )
      .map((a) => a.id as string | number);

    if (missingIds.length === 0) return;

    (async () => {
      await Promise.all(missingIds.map((id) => ensureArayaDetail(id)));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, arayas]);

  // --------------------
  // Filtres / anti-doublons
  // --------------------
  const charactersSorted = useMemo(() => [...characters].sort(sortCharactersLikeListing), [characters]);

  const selectedCharacterIds = useMemo(
    () => new Set(team.filter(Boolean).map((ch) => String((ch as any).id))),
    [team]
  );

  // Personnages (pas 2x le même ; autoriser celui déjà dans la case courante)
  const characterModalData = useMemo(() => {
    const ids = new Set(selectedCharacterIds);
    if (modal?.kind === "character") {
      const currentId = team[modal.slot]?.id as any;
      if (currentId) ids.delete(String(currentId));
    }
    return [...charactersSorted].filter((c: any) => !ids.has(String(c.id))).reverse();
  }, [charactersSorted, selectedCharacterIds, modal, team]);

  // Arayas : fusion des détails + filtres + anti-doublon
  const arayaModalData = useMemo(() => {
    if (modal?.kind !== "araya") return [...arayas].reverse();

    const { characterId, idx } = modal as any;

    const hero =
      team.find((c) => eqId((c as any)?.id, characterId)) ||
      characters.find((c) => eqId((c as any)?.id, characterId)) ||
      null;

    const already = (setups[characterId]?.arayas || []).map((a, i) => (i === idx ? null : a));

    const mergedList: Arayashiki[] = arayas.map((a: any) => {
      const detail = arayaDetails[String(a?.id)] || {};
      const condition = a?.condition ?? detail?.condition;
      const param = a?.param ?? detail?.param;
      return { ...a, condition, param } as Arayashiki;
    });

    const allowed = filterArayasForHero(mergedList, hero, already);
    return allowed.slice().reverse();
  }, [arayas, arayaDetails, setups, modal, team, characters]);

  // Artefacts : filtrage compat + tri
  const artifactModalData = useMemo(() => {
    if (modal?.kind !== "artifact") return artifacts;

    const { characterId } = modal as any;

    const hero =
      team.find((c) => eqId((c as any)?.id, characterId)) ||
      characters.find((c) => eqId((c as any).id, characterId)) ||
      null;

    const base = hero ? filterArtifactsForCharacter(artifacts, hero) : artifacts;

    const getRole = (a: any) => Number(a?.profession ?? 0) || 0;
    const heroRoleCode =
      hero && (Number((hero as any)?.role) || 0) ? Number((hero as any)?.role) : null;

    const sorted = [...base].sort((a, b) => {
      const pa = getRole(a);
      const pb = getRole(b);

      if (heroRoleCode) {
        const aExact = pa === heroRoleCode;
        const bExact = pb === heroRoleCode;
        if (aExact !== bExact) return aExact ? -1 : 1;
      }

      const aGen = pa === 0;
      const bGen = pb === 0;
      if (aGen !== bGen) return aGen ? -1 : 1;

      return resolveName(a, "").localeCompare(resolveName(b, ""));
    });

    return sorted;
  }, [modal, artifacts, team, characters]);

  // --------------------
  // Sélection des tuiles
  // --------------------
  const onSelectCharacter = (ch: Character) => {
    if (readOnly) return;
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
    if (readOnly) return;
    setVestige(v);
    setModal(null);
  };

  const onSelectArtifact = (a: Artifact) => {
    if (readOnly) return;
    if (modal?.kind !== "artifact") return;
    const id = (modal as any).characterId;

    const char =
      team.find((c) => eqId((c as any)?.id, id)) ||
      characters.find((c) => eqId((c as any).id, id));
    if (!canUseArtifact(char || undefined, a)) {
      alert(t("teambuilder.invalidArtefact") || "Cet artefact est limité à une autre classe.");
      return;
    }
    setSetups((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || { arayas: Array(5).fill(null) }), artifact: a },
    }));
    setModal(null);
  };

  const onSelectAraya = (ar: Arayashiki) => {
    if (readOnly) return;
    if (modal?.kind !== "araya") return;
    const { characterId: id, idx } = modal as any;

    const hero =
      team.find((c) => eqId((c as any)?.id, id)) ||
      characters.find((c) => eqId((c as any)?.id, id)) ||
      null;

    const detail = arayaDetails[String((ar as any)?.id)] || {};
    const arMerged = { ...ar, condition: (ar as any).condition ?? detail?.condition, param: (ar as any).param ?? detail?.param };

    const allowed = filterArayasForHero([arMerged], hero);
    if (allowed.length === 0) {
      alert(t("teambuilder.invalidAraya") || "Cette carte Arayashiki n'est pas compatible avec ce personnage.");
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
      next[idx] = arMerged as Arayashiki;
      return { ...prev, [id]: { ...current, arayas: next } };
    });
    setModal(null);
  };

  // --------------------
  // Drag & Drop: réordonner la team (branché à TeamFormation)
  // --------------------
  const handleReorderTeam = (from: number, to: number) => {
    if (readOnly) return;
    setTeam((prev) => {
      if (from < 0 || to < 0 || from >= prev.length || to >= prev.length) return prev;
      if (prev[to] !== null && prev[from] !== null) {
        return swap(prev, from, to);     // SWAP si deux slots occupés
      }
      const copy = prev.slice();          // MOVE sinon
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
    // `setups` reste cohérent car indexé par id perso
  };

  // --------------------
  // Actions globales
  // --------------------
  const resetAll = () => {
    if (readOnly) return;
    setTeam([null, null, null, null, null]);
    setVestige(null);
    setSetups({});
    setTeamName("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const doExport = async () => {
    const dataUrl = await exportAsDataURL({ team, setups, vestige, teamName });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `ssloj-team-${Date.now()}.png`;
    a.click();
  };

  async function shareImage() {
    try {
      const blob = await exportAsBlob({ team, setups, vestige, teamName });
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
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ssloj-team.png";
      a.click();
      URL.revokeObjectURL(url);
      alert(t("teambuilder.imageDownloaded") || "Image téléchargée. Glisse-dépose dans Discord.");
    } catch {
      // ignore
    }
  }

  const shareEditableLink = () => {
    const payload = buildSharableState({ team, setups, vestige, teamName });
    const comp = btoa(JSON.stringify(payload));
    const url = new URL(window.location.href);
    url.searchParams.set("comp", comp);
    url.searchParams.delete("ro");
    navigator.clipboard?.writeText(url.toString());
    alert(t("teambuilder.linkCopied") || "Lien copié !");
  };

  const shareReadonlyLink = () => {
    const payload = buildSharableState({ team, setups, vestige, teamName });
    const comp = btoa(JSON.stringify(payload));
    const url = new URL(window.location.href);
    url.searchParams.set("comp", comp);
    url.searchParams.set("ro", "1");
    navigator.clipboard?.writeText(url.toString());
    alert(t("teambuilder.linkCopied") || "Lien copié !");
  };

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
            <div key={i} className="h-15 w-7 rounded-[2px] bg-white/5 border border-white/10" title="vide" />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <div id="export-root" className="relative mx-auto max-w-6xl p-4 md:p-6 space-y-4 bg-[#0f172a]" ref={exportRef}>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">TEAM BUILDER</h1>
          {readOnly ? (
            <span className="text-xs px-2 py-1 rounded bg-white/10 border border-white/15">
              {t("teambuilder.readonly") || "Lecture seule"}
            </span>
          ) : null}
        </div>

        {/* --- Configs enregistrées --- */}
        {configs.length > 0 ? (
          <div className="border border-white/10">
            <div className="bg-white/5 px-3 py-2 text-[12px] text-white/70">
              {t("teambuilder.configs") || "Configurations"}
            </div>
            <div className="divide-y divide-white/10">
              {configs.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-2 px-3 py-2">
                  <button
                    onClick={() => loadConfig(c.id)}
                    className="flex items-center gap-3 hover:underline"
                    title={t("teambuilder.load") || "Charger cette configuration"}
                  >
                    <span className="text-sm truncate max-w-[40vw]">{c.name}</span>
                    {renderConfigThumbs(c)}
                  </button>
                  {!readOnly && (
                    <button
                      onClick={() => deleteConfig(c.id)}
                      className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20"
                      title={t("teambuilder.delete")}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Nom de la team */}
        <input
          value={teamName}
          onChange={(e) => !readOnly && setTeamName(e.target.value)}
          className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-60"
          placeholder={t("teambuilder.teamName")}
          disabled={readOnly}
        />

        <TeamFormation
          characters={team}
          vestige={vestige}
          onPickVestige={readOnly ? () => {} : openVestigeModal}
          onPickCharacter={readOnly ? () => {} : openCharacterModal}
          // ⬇️ PROP CORRIGÉE : le composant doit appeler onReorder(from, to)
          onReorder={readOnly ? undefined : handleReorderTeam}
        />

        <CharacterSetupGrid
          selectedCharacters={team}
          setups={setups}
          onPickArtifact={readOnly ? () => {} : openArtifactModal}
          onPickAraya={readOnly ? () => {} : openArayaModal}
        />

        {/* Boutons bas de page */}
        <div className="pt-2 md:pt-3 flex flex-wrap items-center justify-end gap-2">
          {!readOnly && (
            <button
              onClick={resetAll}
              className="px-3 py-2 bg-white/5 hover:bg-white/15 border border-white/10 text-red-200"
              title={t("teambuilder.init")}
            >
              {t("teambuilder.init")}
            </button>
          )}

          <button
            onClick={doExport}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 disabled:opacity-60"
            disabled={exporting}
            title={t("teambuilder.export")}
          >
            {exporting ? t("teambuilder.generating") || "Génération…" : t("teambuilder.export")}
          </button>

          <button onClick={shareImage} className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10">
            {t("teambuilder.share")}
          </button>

          <button
            onClick={shareReadonlyLink}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10"
            title={t("teambuilder.linkReadonly") || "Lien lecture seule"}
          >
            {t("teambuilder.linkReadonly")}
          </button>

          {!readOnly && (
            <button
              onClick={saveNewConfig}
              className="px-3 py-2 bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-700/40 rounded-md"
              title={t("teambuilder.saveHint") || "Sauvegarder l'état courant comme nouvelle configuration"}
            >
              {t("teambuilder.save")}
            </button>
          )}
        </div>
      </div>

      {/* Modales */}
      <GridSelectorModal
        open={modal?.kind === "character"}
        onClose={() => setModal(null)}
        title={t("teambuilder.selectCharacter")}
        data={characterModalData}
        renderTile={(c: any) => ({ url: getCharImg(c), label: resolveName(c, "") })}
        onSelect={(c) => onSelectCharacter(c as Character)}
      />
      <GridSelectorModal
        open={modal?.kind === "vestige"}
        onClose={() => setModal(null)}
        title={t("teambuilder.selectSage")}
        data={vestiges}
        renderTile={(v: any) => ({ url: "", label: resolveName(v, "") })}
        onSelect={(v) => onSelectVestige(v as Vestige)}
      />
      <GridSelectorModal
        open={modal?.kind === "artifact"}
        onClose={() => setModal(null)}
        title={t("teambuilder.selectArtefact")}
        data={artifactModalData}
        renderTile={(a: any) => ({ url: getArtifactImg(a), label: resolveName(a, "") })}
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
            <img
              src={arayaOverlayUrl(a.quality)}
              alt="quality overlay"
              className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
            />
          ) : undefined,
        })}
        onSelect={(a) => onSelectAraya(a as Arayashiki)}
      />
    </div>
  );
}
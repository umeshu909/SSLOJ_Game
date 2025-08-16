import { useEffect, useMemo, useState } from "react";
import { Artifact, Arayashiki, Character, Setups, Vestige } from "@/lib/teambuilder/types";
import { STORAGE_KEY } from "@/lib/teambuilder/data";

export function useTeamState() {
  const [team, setTeam] = useState<(Character | null)[]>([null, null, null, null, null]);
  const [vestige, setVestige] = useState<Vestige | null>(null);
  const [setups, setSetups] = useState<Setups>({});
  const [teamName, setTeamName] = useState<string>("");

  // load
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

  // save
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ team, vestige, setups, teamName }));
    } catch {}
  }, [team, vestige, setups, teamName]);

  return { team, setTeam, vestige, setVestige, setups, setSetups, teamName, setTeamName };
}
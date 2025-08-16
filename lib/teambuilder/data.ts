export const DATA_SOURCES = {
  characters: "/api/characters",
  arayashikis: "/api/arayashikis",
  vestiges: "/api/vestiges",
  artifacts: "/api/artifacts",
} as const;

export function getLang(): string {
  if (typeof window === "undefined") return "FR";
  return localStorage.getItem("lang") || localStorage.getItem("dbChoice") || "FR";
}

export async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { "x-db-choice": getLang() } as any });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

export const STORAGE_KEY = "ssloj_team_builder_v1";
export const STORAGE_KEY_CONFIGS = "ssloj_team_builder_configs_v1";
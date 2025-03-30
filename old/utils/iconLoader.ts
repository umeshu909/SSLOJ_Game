type IconMap = Record<
  string,
  {
    x: number;
    y: number;
    width: number;
    height: number;
  }
>;

// Stockage global pour les icônes
const iconDataCache: Record<string, IconMap> = {};
const loadedImages: Record<string, HTMLImageElement> = {};

// Pour récupérer le chemin d’une image d’atlas via le préfixe
export async function getImageSrc(prefix: string): Promise<string | null> {
  const images = await getAllImageFiles("/images/atlas/");
  const found = images.find((file) => file.startsWith(prefix));
  return found ? `/images/atlas/${found}` : null;
}

// Simule la récupération de tous les fichiers image du dossier (car pas de fs côté client)
async function getAllImageFiles(path: string): Promise<string[]> {
  // À personnaliser si tu utilises un système de mapping statique ou un manifest JSON
  // Ici on fait semblant de connaître les images dispo
  return [
    "sactx-0-4096x2048-ASTC 6x6-icon_jineng-0.png",
    "sactx-0-4096x2048-ASTC 6x6-icon_touxiang-0.png",
    "sactx-0-4096x4096-ASTC 6x6-icon_daojv-0.png",
  ];
}

// Charge les icônes dans le cache global à partir d’un fichier JSON + image
export async function loadIcons(
  imageSrc: string,
  jsonDir: string,
  scale: number,
  imgHeight: number
) {
  const baseName = imageSrc.split("/").pop()?.split(".")[0];
  if (!baseName) return;

  const jsonPath = `${jsonDir}${baseName}.json`;

  try {
    const res = await fetch(jsonPath);
    const json = await res.json();
    const frames = json.frames || {};

    const icons: IconMap = {};
    for (const key in frames) {
      const frame = frames[key].frame;
      icons[key.replace(".png", "")] = {
        x: frame.x / scale,
        y: frame.y / scale,
        width: frame.w / scale,
        height: frame.h / scale,
      };
    }

    const img = new Image();
    img.src = imageSrc;
    await img.decode();

    iconDataCache[jsonDir] = icons;
    loadedImages[jsonDir] = img;
  } catch (e) {
    console.error("Erreur chargement icônes :", e);
  }
}

// Ces getters sont utilisés dans IconCanvas
export function getIconData(jsonDir: string, iconName: string) {
  return iconDataCache[jsonDir]?.[iconName] || null;
}

export function getAtlasImage(jsonDir: string): HTMLImageElement | null {
  return loadedImages[jsonDir] || null;
}
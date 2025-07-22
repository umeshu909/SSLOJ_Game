// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 👉 Exemple : table en cache ou à remplacer par requête réelle vers l’API ou DB
const idToSlugMap: Record<string, string> = {
  "1": "hades-debarque-le-souverain-des-enfers-rejoint-la-bataille",
  "3": "comprendre-la-roue-du-destin",
  "4": "callisto-bien-plus-qu-un-simple-soutien-d-artemis",
  "5": "et-si-on-reparlait-du-nerf-d-hecate",
  "12": "difference-entre-vitesse-d-attaque-et-acceleration",
  "13": "focus-sur-shijima-de-la-vierge",
  "14": "pourquoi-certains-personnages-paraissent-moins-fort-qu-avant",
  "15": "guide-des-artefacts",
  "16": "comprendre-le-fonctionnement-de-la-jauge-de-cosmos",
  "17": "comment-scorer-en-illusion-du-vide",
  "18": "froid-gel-glaciation-quelles-differences",
  "19": "definition-des-icones-dans-le-jeu",
  "20": "classement-des-skills-d-ouverture-par-vitesse",
  "21": "focus-sur-ox-du-taureau",
  "22": "focus-sur-suikyo-garuda",
  "23": "poing-de-la-vitesse-de-la-lumiere-vs-explosion-du-cosmos",
  "24": "deux-facteurs-qui-determinent-la-victoire-dans-saint-seiya",
  "25": "focus-sur-rascumoon-la-scoumoune",
  "26": "comment-ignorer-les-effets-de-fort-interruption",
  "27": "comment-installer-et-jouer-a-la-version-chinoise-traditionnelle",
  "28": "nouveau-mode-sur-la-version-chinoise-defendre-le-sanctuaire",
  "29": "debuter-dans-saint-seiya-legend-of-justice",
  "30": "nouveau-gameplay-pour-le-dieu-de-la-mort",
  "31": "le-saint-sans-defense-une-super-star-oubliee",
  "32": "pourquoi-faut-il-combiner-brise-passif-et-dispersion-puissante",
  "33": "comment-contrer-minos",
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Matche les anciennes URLs de type /articles/123
  const match = url.pathname.match(/^\/articles\/(\d+)$/);

  if (match) {
    const id = match[1];
    const slug = idToSlugMap[id];

    if (slug) {
      url.pathname = `/articles/${slug}`;
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

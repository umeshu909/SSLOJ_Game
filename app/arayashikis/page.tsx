"use client";
import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";

// Structure d'un Arayashiki retourné par l'API
interface Arayashiki {
  id: number;
  name: string;
  pic: string;
  quality: string;
  level: string;
  Attrib1?: string;
  Attrib2?: string;
  Attrib3?: string;
  Attrib4?: string;
  hero_names?: string;
}

// Mapping qualité vers style (classe Tailwind pour bg et border)
const qualityStyleMap: Record<string, { bg: string; border: string }> = {
  Gris: { bg: "bg-gray-500", border: "border-gray-500" },
  Bleu: { bg: "bg-blue-500", border: "border-blue-500" },
  Violet: { bg: "bg-purple-500", border: "border-purple-500" },
  Or: { bg: "bg-yellow-500", border: "border-yellow-500" },
  Rouge: { bg: "bg-red-500", border: "border-red-500" },
};

const ArayashikisPage = () => {
  const [arayashikis, setArayashikis] = useState<Arayashiki[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);
  const [availableAttributes, setAvailableAttributes] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [lang, setLang] = useState<string | null>(null);

  // Récupération des données depuis l'API
  const fetchArayashikis = async () => {
    if (!lang) return;

    const qualityToIndex = { Gris: 1, Bleu: 2, Violet: 3, Or: 4, Rouge: 5 };
    const qualityParam = selectedQuality ? `?quality=${qualityToIndex[selectedQuality]}` : "";

    const res = await fetch(`/api/arayashikis${qualityParam}`, {
      headers: { "x-db-choice": lang },
    });
    const data = await res.json();

    const attrSet = new Set<string>();
    data.forEach((a: Arayashiki) => {
      [a.Attrib1, a.Attrib2, a.Attrib3, a.Attrib4].forEach(attr => {
        if (attr) attrSet.add(attr);
      });
    });

    setAvailableAttributes(Array.from(attrSet));
    setArayashikis(data.reverse());
  };

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "FR";
    setLang(storedLang);
  }, []);

  useEffect(() => {
    if (lang !== null) fetchArayashikis();
  }, [selectedQuality, lang]);

  // Application des filtres sélectionnés
  const filteredArayashikis = arayashikis.filter((a) => {
    const matchAttr = selectedAttribute ? [a.Attrib1, a.Attrib2, a.Attrib3, a.Attrib4].includes(selectedAttribute) : true;
    return matchAttr;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white pb-20">
      <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 pt-[12px]">
        {/* Filtres Desktop */}
        <div className="hidden lg:flex flex-col w-[320px] sticky top-[132px] h-fit bg-[#14122a] p-6 text-white">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filtres</h2>
            {/* Annulation des filtres */}
            {(selectedQuality || selectedAttribute) && (
            <button
              onClick={() => {
                setSelectedQuality(null);
                setSelectedAttribute(null);
              }}
              className="text-white hover:text-red-500 text-xl"
              title="Réinitialiser les filtres"
            >
              <span className="text-xs ml-1 inline-flex items-center gap-1 cursor-pointer">
                Réinitialiser <XCircle size={14} className="text-red-500" />
              </span>
            </button>
            )}
          </div>

          {/* Filtres qualité */}
          <div className="mb-6">
            <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Qualité</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(qualityStyleMap).map(([label, style]) => {
                const isSelected = selectedQuality === label;
                return (
                  <button
                    key={label}
                    onClick={() => setSelectedQuality(prev => (prev === label ? null : label))}
                    className={`w-8 h-8 rounded border-2 transition-all ${style.bg} ${
                      isSelected ? `opacity-100 ${style.border}` : "opacity-40 border-white/40"
                    } hover:opacity-60 hover:${style.border}`}
                    title={label}
                  />
                );
              })}
            </div>
          </div>

          {/* Filtres attributs */}
          <div className="mb-6">
            <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Attribut</h3>
            <div className="flex flex-wrap gap-2">
              {availableAttributes.map((attr) => (
                <button
                  key={attr}
                  onClick={() => setSelectedAttribute(prev => (prev === attr ? null : attr))}
                  className={`rounded-full px-4 py-2 text-sm cursor-pointer border transition-all ${
                    selectedAttribute === attr
                      ? "text-white bg-purple-300/15 border-white/80"
                      : "text-white/70 bg-transparent border-white/40"
                  } hover:text-white hover:border-white`}
                >
                  {attr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grille de cartes */}
        <div className="w-full lg:w-3/4 lg:px-6">
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-3">
            {filteredArayashikis.length === 0 ? (
              <p className="text-center text-lg">Aucune carte trouvée</p>
            ) : (
              filteredArayashikis.map((arayashiki) => (
                <a
                  key={arayashiki.id}
                  href={`/arayashikis/${arayashiki.id}`}
                  className="group block rounded-xl overflow-visible mb-1"
                >
                  <div className="relative w-full aspect-[3/4]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 transition-all duration-300 ease-in-out group-hover:scale-103 w-[90%] h-[90%]">
                      <img
                        src={arayashiki.pic}
                        alt={arayashiki.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {arayashiki.quality && (
                      <img
                        src={`/overlays/quality-${arayashiki.quality}.png`}
                        alt="Habillage qualité"
                        className="absolute top-0 left-0 w-full h-full object-contain z-10 pointer-events-none"
                      />
                    )}
                  </div>
                  <div className="mt-1 px-1">
                    <h3 className="text-sm font-semibold text-white text-center leading-tight">
                      {arayashiki.name}
                    </h3>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bouton mobile "Filtrer" */}
      <div className="lg:hidden fixed bottom-4 left-0 right-0 flex justify-center z-40">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-[#82B0D6] text-[#0a091c] font-semibold py-2 px-6 rounded-full shadow-lg"
        >
          Filtrer
        </button>
      </div>

      {/* Panneau des filtres mobile */}
      <div className={`lg:hidden fixed inset-0 bg-[#0a091c] z-50 overflow-y-auto p-6 transition-transform duration-300 ease-in-out ${showMobileFilters ? "translate-y-0" : "translate-y-full pointer-events-none"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Filtres</h2>
          
          <div className="flex space-x-2">
            {/* Annulation filtres */}
            <button
              onClick={() => {
                setSelectedQuality(null);
                setSelectedAttribute(null);
              }}
              className="text-white hover:text-red-500 text-xl"
              title="Réinitialiser les filtres"
            >
              <span className="text-xs ml-1 inline-flex items-center gap-1 cursor-pointer">
                Réinitialiser <XCircle size={14} className="text-red-500" />
              </span>
            </button>
            {/* Bouton Fermer */}
            <button
              onClick={() => setShowMobileFilters(false)}
              className="text-white text-sm border border-white/30 px-3 py-1 rounded"
            >
              Fermer
            </button>
          </div>

        </div>

        {/* Qualité mobile */}
        <div className="mb-6">
          <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Qualité</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(qualityStyleMap).map(([label, style]) => {
              const isSelected = selectedQuality === label;
              return (
                <button
                  key={label}
                  onClick={() => setSelectedQuality(prev => (prev === label ? null : label))}
                  className={`w-8 h-8 rounded border-2 transition-all ${style.bg} ${
                    isSelected ? `opacity-100 ${style.border}` : "opacity-40 border-white/40"
                  } hover:opacity-60 hover:${style.border}`}
                  title={label}
                />
              );
            })}
          </div>
        </div>

        {/* Attributs mobile */}
        <div className="mb-6">
          <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Attribut</h3>
          <div className="flex flex-wrap gap-2">
            {availableAttributes.map((attr) => (
              <button
                key={attr}
                onClick={() => setSelectedAttribute(prev => (prev === attr ? null : attr))}
                className={`rounded-full px-4 py-2 text-sm cursor-pointer border transition-all ${
                  selectedAttribute === attr
                    ? "text-white bg-purple-300/15 border-white/80"
                    : "text-white/70 bg-transparent border-white/40"
                } hover:text-white hover:border-white`}
              >
                {attr}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArayashikisPage;
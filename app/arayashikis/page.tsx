"use client";
import { useEffect, useState } from "react";

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

const qualityMapping: Record<number, string> = {
    2: "bg-gray-500",
    3: "bg-blue-500",
    4: "bg-purple-500",
    5: "bg-yellow-500",
    6: "bg-red-500"
};

const ArayashikisPage = () => {
    const [arayashikis, setArayashikis] = useState<Arayashiki[]>([]);
    const [selectedQuality, setSelectedQuality] = useState<number | null>(null);
    const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [availableAttributes, setAvailableAttributes] = useState<string[]>([]);
    const [availableTypes, setAvailableTypes] = useState<string[]>([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const fetchArayashikis = async () => {
        const lang = localStorage.getItem("lang") || "FR";
        const qualityParam = selectedQuality !== null ? `?quality=${selectedQuality}` : "";
        const res = await fetch(`/api/arayashikis${qualityParam}`, {
            headers: {
                "x-db-choice": lang
            }
        });
        const data = await res.json();

        const attrSet = new Set<string>();
        const typeSet = new Set<string>();

        data.forEach((a: Arayashiki) => {
            [a.Attrib1, a.Attrib2, a.Attrib3, a.Attrib4].forEach(attr => {
                if (attr) attrSet.add(attr);
            });
            if (a.hero_names) typeSet.add(a.hero_names);
        });

        setAvailableAttributes(Array.from(attrSet));
        setAvailableTypes(Array.from(typeSet));
        setArayashikis(data.reverse());
    };

    useEffect(() => {
        fetchArayashikis();
    }, [selectedQuality]);

    const filteredArayashikis = arayashikis.filter((a) => {
        const matchAttr = selectedAttribute ? [a.Attrib1, a.Attrib2, a.Attrib3, a.Attrib4].includes(selectedAttribute) : true;
        const matchType = selectedType ? a.hero_names === selectedType : true;
        return matchAttr && matchType;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white pb-20">
            <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 pt-[12px]">
                {/* Sidebar Desktop */}
                <div className="hidden lg:flex flex-col w-[320px] sticky top-[132px] h-fit bg-[#14122a] p-6 text-white">
                    <h2 className="text-xl font-semibold mb-4">Filtres</h2>

                    <div className="mb-6">
                        <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Qualité</h3>
                        <div className="space-x-2">
                            {Object.keys(qualityMapping).map((key) => {
                                const qualityId = Number(key);
                                return (
                                    <button
                                        key={qualityId}
                                        className={`w-8 h-8 rounded m-1 border-2 ${selectedQuality === qualityId ? "border-[#82B0D6]" : "border-white/20"} ${qualityMapping[qualityId]} hover:border-[#82B0D6] transition-all`}
                                        onClick={() => setSelectedQuality((prev) => (prev === qualityId ? null : qualityId))}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Attribut</h3>
                        <div className="flex flex-wrap gap-2">
                            {availableAttributes.map((attr) => (
                                <button
                                    key={attr}
                                    onClick={() => setSelectedAttribute((prev) => (prev === attr ? null : attr))}
                                    className={`rounded-full px-4 py-2 text-sm cursor-pointer border transition-all
                    ${selectedAttribute === attr
                                            ? "text-white bg-purple-300/15 border-white/80"
                                            : "text-white/70 bg-transparent border-white/40"}
                    hover:text-white hover:border-white`}
                                >
                                    {attr}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* <div>
                        <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Type de chevalier</h3>
                        <div className="flex flex-wrap gap-2">
                            {availableTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType((prev) => (prev === type ? null : type))}
                                    className={`rounded-full px-4 py-2 text-sm cursor-pointer border transition-all
                    ${selectedType === type
                                            ? "text-white bg-purple-300/15 border-white/80"
                                            : "text-white/70 bg-transparent border-white/40"}
                    hover:text-white hover:border-white`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>*/}
                </div>

                {/* Grille des cartes */}
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

            {/* Bouton Filtrer Mobile */}
            <div className="lg:hidden fixed bottom-4 left-0 right-0 flex justify-center z-40">
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="bg-[#82B0D6] text-[#0a091c] font-semibold py-2 px-6 rounded-full shadow-lg"
                >
                    Filtrer
                </button>
            </div>

            {/* Panneau de filtres Mobile */}
            <div className={`fixed inset-0 bg-[#0a091c] z-50 overflow-y-auto p-6 transition-transform duration-300 ease-in-out ${showMobileFilters ? "translate-y-0" : "translate-y-full pointer-events-none"}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Filtres</h2>
                    <button
                        onClick={() => setShowMobileFilters(false)}
                        className="text-white text-sm border border-white/30 px-3 py-1 rounded"
                    >
                        Fermer
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Qualité</h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(qualityMapping).map((key) => {
                            const qualityId = Number(key);
                            return (
                                <button
                                    key={qualityId}
                                    className={`w-8 h-8 rounded border-2 ${selectedQuality === qualityId ? "border-[#82B0D6]" : "border-white/20"} ${qualityMapping[qualityId]} hover:border-[#82B0D6] transition-all`}
                                    onClick={() => setSelectedQuality((prev) => (prev === qualityId ? null : qualityId))}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Attribut</h3>
                    <div className="flex flex-wrap gap-2">
                        {availableAttributes.map((attr) => (
                            <button
                                key={attr}
                                onClick={() => setSelectedAttribute((prev) => (prev === attr ? null : attr))}
                                className={`rounded-full px-4 py-2 text-sm cursor-pointer border transition-all
                  ${selectedAttribute === attr
                                        ? "text-white bg-purple-300/15 border-white/80"
                                        : "text-white/70 bg-transparent border-white/40"}
                  hover:text-white hover:border-white`}
                            >
                                {attr}
                            </button>
                        ))}
                    </div>
                </div>

                {/*<div>
          <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Type de chevalier</h3>
          <div className="flex flex-wrap gap-2">
            {availableTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType((prev) => (prev === type ? null : type))}
                className={`rounded-full px-4 py-2 text-sm cursor-pointer border transition-all
                  ${selectedType === type
                    ? "text-white bg-purple-300/15 border-white/80"
                    : "text-white/70 bg-transparent border-white/40"}
                  hover:text-white hover:border-white`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>*/}
            </div>
        </div>
    );
};

export default ArayashikisPage;
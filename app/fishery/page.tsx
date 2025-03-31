"use client";
import { useEffect, useState } from "react";
import IconCanvas from "@/components/IconCanvas";

interface Fish {
  ZoneNom: string;
  Zone: string;
  id: number;
  Poisson: string;
  Appât: string;
  Grade: string;
  Espece: string;
  iconid: string;
  iconid2: string;
  fishgrade: number;
  stat1: string;
  stat2: string;
  stat3: string;
}

const gradeBorderClasses: Record<string, string> = {
  Bleu: "border-blue-500",
  Violet: "border-purple-500",
  Or: "border-yellow-400",
  Rouge: "border-red-500",
  Platine: "border-2 border-white shadow-[0_0_10px_2px_rgba(255,255,255,0.5)] animate-pulse",
};

const availableGrades = [
  { id: 1, label: "Bleu" },
  { id: 2, label: "Violet" },
  { id: 3, label: "Or" },
  { id: 4, label: "Rouge" },
  { id: 5, label: "Platine" },
];

const speciesLabels: Record<string, string> = {
  "1": "Petit",
  "2": "Moyen",
  "3": "Grand",
  "4": "Créature marine",
  "5": "Crustacé",
  "6": "Trésor",
};

const speciesTypePerso: Record<string, string> = {
  "1": "Compétence",
  "2": "Assassin",
  "3": "Guerrier",
  "4": "Assistant",
  "5": "Tank",
  "6": "N/A",
};

const FishPage = () => {
    const [fishes, setFishes] = useState<Fish[]>([]);
    const [selectedZone, setSelectedZone] = useState<string | null>(null);
    const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
    const [availableZones, setAvailableZones] = useState<string[]>([]);
    const [availableSpecies, setAvailableSpecies] = useState<string[]>([]);
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);


    const prefix = "sactx-0-4096x4096-ASTC 6x6-icon_daojv-";

    const fetchFishes = async () => {
        const params = new URLSearchParams();
        if (selectedZone) params.append("fisheryid", selectedZone);
        if (selectedSpecies) params.append("fishspecies", selectedSpecies);
        if (selectedGrade !== null) params.append("fishgrade", selectedGrade.toString());

        const lang = localStorage.getItem("lang") || "FR";
        const res = await fetch(`/api/fishes?${params.toString()}`, {
          headers: {
            "x-db-choice": localStorage.getItem("lang") || "FR",
          },
        });
        const data = await res.json();
        setFishes(data);

        // Extraire zones & espèces uniques pour les filtres
        const zones = [...new Set(data.map((f: Fish) => f.Zone))];
        const species = [...new Set(data.map((f: Fish) => f.fishspecies?.toString()))];
        setAvailableZones(zones);
        setAvailableSpecies(species);
    };

    useEffect(() => {
      fetchFishes();
    }, [selectedZone, selectedSpecies, selectedGrade]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white py-6 px-4 max-w-screen-xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filtres */}
        <div className="w-full lg:w-[300px] bg-[#14122a] p-4 rounded-xl space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Filtrer par zone</h3>
            <div className="flex flex-wrap gap-2">
              {availableZones.map((zone) => (
                <button
                  key={zone}
                  onClick={() =>
                    setSelectedZone((prev) => (prev === zone ? null : zone))
                  }
                  className={`px-3 py-1 rounded text-sm border transition ${
                    selectedZone === zone
                      ? "bg-blue-600 border-blue-400"
                      : "bg-white/10 border-white/20 hover:border-white/40"
                  }`}
                >
                  Zone {zone}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Filtrer par espèce</h3>
            <div className="flex flex-wrap gap-2">
                {availableSpecies.map((spec) => (
                  <button
                    key={spec}
                    onClick={() =>
                      setSelectedSpecies((prev) => (prev === spec ? null : spec))
                    }
                    className={`px-3 py-1 rounded text-sm border transition ${
                      selectedSpecies === spec
                        ? "bg-green-600 border-green-400"
                        : "bg-white/10 border-white/20 hover:border-white/40"
                    }`}
                  >
                    {speciesLabels[spec] || `Espèce ${spec}`}
                  </button>
                ))}

            </div>
          </div>


            <div>
                <h3 className="text-lg font-semibold mb-2">Filtrer par grade</h3>
                <div className="flex flex-wrap gap-2">
                    {availableGrades.map((grade) => (
                    <button
                        key={grade.id}
                        onClick={() =>
                          setSelectedGrade((prev) => (prev === grade.id ? null : grade.id))
                        }
                        className={`px-3 py-1 rounded text-sm border transition ${
                          selectedGrade === grade.id
                            ? "bg-yellow-500 border-yellow-300"
                            : "bg-white/10 border-white/20 hover:border-white/40"
                        }`}
                    >
                        {grade.label}
                    </button>
                    ))}
                </div>
            </div>

        </div>


        {/* Résultats */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {fishes.length === 0 ? (
            <p className="col-span-full text-center text-white/60">
              Aucun poisson trouvé.
            </p>
          ) : (

            fishes.map((fish, i) => {
              const isExpanded = expandedIndex === i;

              return (
                <div
                  key={i}
                  onClick={() => setExpandedIndex(i === expandedIndex ? null : i)}
                  className={`rounded-xl cursor-pointer overflow-hidden border-2 transition-all duration-300
                    ${gradeBorderClasses[fish.Grade] || "border-white/10"} 
                    ${isExpanded ? "bg-[#252448] scale-105 shadow-lg" : "bg-[#1c1b3a]"}
                  `}
                >
                  <div className="aspect-square p-2 flex flex-col items-center text-center space-y-1">
               
                    <p className="mt-2 text-sm font-semibold">{fish.Poisson}</p>

                    <div className="max-h-20 w-full flex items-center justify-center overflow-hidden">
                        <IconCanvas
                          prefix={prefix}
                          iconName={fish.iconid}
                          jsonDir="/images/atlas/icon_daojv/"
                          canvasId={`canvas-${fish.Poisson}`}
                          imgHeight={4096}
                          size={2}
                        />
                    </div>

                    {isExpanded && (
                      <div className="mt-2 space-y-1 text-xs text-white/60">

                        <p>
                          {[fish.stat1, fish.stat2, fish.stat3].filter(Boolean).join(" / ") || "N/A"}
                        </p>

                        <p>Espèce : {speciesLabels[fish.fishgrade] || "Inconnue"}</p>
                        <p>Type perso : {speciesTypePerso[fish.fishgrade] || "Inconnue"}</p>

                        <p>Appât : {fish.Appât || "N/A"}</p>
                        {fish.Appât && (
                          <div className="max-h-20 w-full  flex items-center justify-center">
                            <IconCanvas
                              prefix={prefix}
                              iconName={fish.iconid2}
                              jsonDir="/images/atlas/icon_daojv/"
                              canvasId={`canvas-${fish.Appât}`}
                              imgHeight={4096}
                              size={2}
                            />
                          </div>
                        )}



                      </div>
                    )}

                  </div>
                </div>
              );
            })


          )}
        </div>
      </div>
    </div>
  );
};

export default FishPage;

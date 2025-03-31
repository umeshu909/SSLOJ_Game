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

const availableGrades = ["Bleu", "Violet", "Or", "Rouge", "Platine"];
const availableZones = ["1", "2", "3", "4", "5"];

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

const getStaticBorderColor = (grade: string) => {
  switch (grade) {
    case "Bleu": return "border-blue-500";
    case "Violet": return "border-purple-500";
    case "Or": return "border-yellow-400";
    case "Rouge": return "border-red-500";
    default: return "border-white/10";
  }
};

const getStaticBackgroundColor = (grade: string) => {
  switch (grade) {
    case "Bleu": return "bg-blue-500/10";
    case "Violet": return "bg-purple-500/10";
    case "Or": return "bg-yellow-400/10";
    case "Rouge": return "bg-red-500/10";
    default: return "bg-[#1c1b3a]/90";
  }
};

const FishPage = () => {
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [selectedBonus, setSelectedBonus] = useState<string | null>(null);
  const [availableBonuses, setAvailableBonuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const prefix = "sactx-0-4096x4096-ASTC 6x6-icon_daojv-";

  const fetchFishes = async () => {
    const lang = localStorage.getItem("lang") || "FR";
    const res = await fetch(`/api/fishes`, {
      headers: { "x-db-choice": lang },
    });
    const data = await res.json();
    setFishes(data);

    const bonusSet = new Set<string>();
    data.forEach((f: Fish) => {
      [f.stat1, f.stat2, f.stat3].forEach((s) => {
        if (s) bonusSet.add(s.trim());
      });
    });
    setAvailableBonuses(Array.from(bonusSet));
  };

  useEffect(() => {
    fetchFishes();
  }, []);

  const filteredFishes = fishes.filter((f) => {
    const matchesZone = selectedZone ? f.Zone === selectedZone : true;
    const matchesGrade = selectedGrade ? f.Grade === selectedGrade : true;
    const matchesSpecies = selectedSpecies ? f.fishgrade.toString() === selectedSpecies : true;
    const matchesBonus = selectedBonus
      ? [f.stat1, f.stat2, f.stat3].some((s) => s && s.includes(selectedBonus))
      : true;
    const matchesSearch = searchQuery.trim() !== ""
      ? f.Poisson.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesZone && matchesGrade && matchesSpecies && matchesBonus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white py-6 px-4 max-w-screen-xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filtres */}
        <div className="w-full lg:w-[320px] sticky top-[98px] h-[calc(100vh-120px)] overflow-y-auto bg-[#14122a] rounded-xl p-6 text-white custom-scrollbar">
          <h2 className="text-2xl font-semibold mb-4">Filtres</h2>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Rechercher un poisson"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-full text-sm border border-white/20 focus:border-[#82B0D6] focus:outline-none w-full bg-[#0e0c1e] text-white"
            />
          </div>

          {/* Zones */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Zone</h3>
            <div className="flex flex-wrap gap-2">
              {availableZones.map((z) => (
                <button
                  key={z}
                  onClick={() => setSelectedZone((prev) => (prev === z ? null : z))}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    selectedZone === z ? "border-[#82B0D6]" : "border-white/20"
                  } bg-transparent hover:border-[#82B0D6] transition-all`}
                >
                  Zone {z}
                </button>
              ))}
            </div>
          </div>

          {/* Bonus */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Type de bonus</h3>
            <div className="flex flex-wrap gap-2">
              {availableBonuses.map((bonus) => (
                <button
                  key={bonus}
                  onClick={() => setSelectedBonus((prev) => (prev === bonus ? null : bonus))}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    selectedBonus === bonus ? "border-[#82B0D6]" : "border-white/20"
                  } bg-transparent hover:border-[#82B0D6] transition-all`}
                >
                  {bonus}
                </button>
              ))}
            </div>
          </div>

          {/* Grade */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Rareté</h3>
            <div className="flex flex-wrap gap-2">
              {availableGrades.map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade((prev) => (prev === grade ? null : grade))}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    selectedGrade === grade ? "border-[#82B0D6]" : "border-white/20"
                  } bg-transparent hover:border-[#82B0D6] transition-all`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          {/* Espèces */}
          <div>
            <h3 className="text-lg font-medium mb-2">Espèce</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(speciesLabels).map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecies((prev) => (prev === spec ? null : spec))}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    selectedSpecies === spec ? "border-[#82B0D6]" : "border-white/20"
                  } bg-transparent hover:border-[#82B0D6] transition-all`}
                >
                  {speciesLabels[spec]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFishes.length === 0 ? (
            <p className="col-span-full text-center text-white/60">
              Aucun poisson trouvé.
            </p>
          ) : (
            filteredFishes.map((fish, i) => {
              const isPlatine = fish.Grade === "Platine";
              const borderClass = isPlatine
                ? "border-animated-gradient"
                : `border-2 ${getStaticBorderColor(fish.Grade)}`;
              const backgroundClass = isPlatine
                ? "bg-[#1c1b3a]/90"
                : getStaticBackgroundColor(fish.Grade);

              return (
                <div
                  key={i}
                  className={`${borderClass} overflow-hidden h-[300px] flex flex-col`}
                >
                  <div className={`${backgroundClass} h-full flex flex-col py-4`}>
                    <div className="w-full aspect-[2/1] flex items-center justify-center">
                      <IconCanvas
                        prefix={prefix}
                        iconName={fish.iconid}
                        jsonDir="/images/atlas/icon_daojv/"
                        canvasId={`canvas-${fish.Poisson}`}
                        imgHeight={4096}
                        size={2}
                      />
                    </div>
                    <div className="flex flex-col p-3 flex-1">
                      <p className="text-sm font-semibold text-center mb-2">{fish.Poisson}</p>
                      <div className="text-sm text-white/70 space-y-1 text-left">
                        <p><span className="text-white/50">Bonus :</span> {[fish.stat1, fish.stat2, fish.stat3].filter(Boolean).join(" / ") || "N/A"}</p>
                        <p><span className="text-white/50">Espèces :</span> {speciesLabels[fish.fishgrade] || "Inconnue"}</p>
                        <p><span className="text-white/50">Perso :</span> {speciesTypePerso[fish.fishgrade] || "Inconnue"}</p>
                      </div>
                      {fish.Appât && (
                        <div className="mt-auto pt-2 flex items-center text-sm justify-between text-white/60">
                          <span>{fish.Appât}</span>
                          <div className="w-8 h-8 flex items-center justify-center">
                            <IconCanvas
                              prefix={prefix}
                              iconName={fish.iconid2}
                              jsonDir="/images/atlas/icon_daojv/"
                              canvasId={`canvas-${fish.Appât}`}
                              imgHeight={4096}
                              size={3}
                            />
                          </div>
                        </div>
                      )}
                    </div>
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
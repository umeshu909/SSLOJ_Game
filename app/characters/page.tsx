"use client";
import { useEffect, useState } from "react";
import { Filter, X, Search } from "lucide-react";

interface Character {
  id: number;
  image: string;
  name: string;
  role: string;
  type: string;
  link: string;
}

const roleMapping: Record<number, string> = {
  1: "Tank",
  2: "Guerrier",
  3: "Compétence",
  4: "Assassin",
  5: "Support",
};

const typeMapping: Record<number, string> = {
  1: "Eau",
  2: "Feu",
  3: "Vent",
  4: "Terre",
  5: "Lumière",
  6: "Ombre",
};

const CharactersPage = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const fetchCharacters = async () => {
    const lang = localStorage.getItem("lang") || "FR";
    const res = await fetch(
      `/api/characters?role=${selectedRoles.join(",")}&type=${selectedTypes.join(",")}&searchQuery=${searchQuery}&onlyAvailable=${onlyAvailable}`,
      {
        headers: {
          "x-db-choice": lang,
        },
      }
    );
    const data = await res.json();
    setCharacters(data.reverse());
  };

  useEffect(() => {
    fetchCharacters();
  }, [selectedRoles, selectedTypes, searchQuery, onlyAvailable]);

  const toggleRole = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const toggleType = (typeId: number) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOnlyAvailableToggle = () => {
    setOnlyAvailable((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white relative pb-20 pt-[20px]">
      {/* Recherche mobile */}
      <div className="lg:hidden w-full px-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher un personnage"
          value={searchQuery}
          onChange={handleSearch}
          className="px-4 py-2 rounded-full text-sm border border-white/20 focus:border-[#82B0D6] focus:outline-none w-full bg-[#14122a] text-white"
        />
      </div>

      <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-4">
        {/* Filtres desktop */}
        <div className="hidden lg:flex flex-col w-[320px] sticky top-[98px] h-fit bg-[#14122a] p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Filtres</h2>

          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un poissonss"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-purple-300/10 border rounded pl-10 pr-4 py-3 border-transparent text-sm focus:outline-none focus:border-purple-300/30 focus:border focus:bg-purple-300/15 w-full text-white hover:bg-purple-300/15 transition-all duration-300 ease-in-out"
            />
          </div>

          <div className="flex items-center mb-6 p-4 border border-white/20 rounded">
            <label className="mr-2 text-s text-white/50">
              Afficher uniquement les disponibles
            </label>
            
            <div
              onClick={handleOnlyAvailableToggle}
              className={`relative inline-block w-12 h-6 rounded-full transition-all cursor-pointer ${
                onlyAvailable ? "bg-green-500" : "bg-gray-500"
              }`}
            >
              <div
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  onlyAvailable ? "translate-x-[12px]" : ""
                }`}
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Rôle</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(roleMapping).map((key) => {
                const roleId = Number(key);
                return (
                  <button
                    key={roleId}
                    onClick={() => toggleRole(roleId)}
                    className={`rounded-full px-4 py-2 rounded cursor-pointer text-sm border text-white/70  ${
                      selectedRoles.includes(roleId)
                      ? "text-white/100 bg-purple-300/15 border-white/80"
                      : "text-white/70 bg-transparent border-white/40"}  
                    hover:text-white hover:border-white transition-all`}
                  >
                    {roleMapping[roleId]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Type</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(typeMapping).map((key) => {
                const typeId = Number(key);
                return (
                  <button
                    key={typeId}
                    onClick={() => toggleType(typeId)}
                    className={`rounded-full px-4 py-2 rounded cursor-pointer text-sm border text-white/70 ${
                      selectedTypes.includes(typeId)
                      ? "text-white/100 bg-purple-300/15 border-white/80"
                      : "text-white/70 bg-transparent border-white/40"}  
                    hover:text-white hover:border-white transition-all`}
                  >
                    {typeMapping[typeId]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grille de personnages */}
        <div className="w-full lg:w-3/4 lg:px-6">
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-3">
            {characters.length === 0 ? (
              <p className="text-center text-lg">Aucun personnage trouvé</p>
            ) : (
              characters.map((character) => (
                <div key={character.id} className="border-animated-gradient">
                  <a
                    href={character.link}
                    className="group block bg-[#0a091c] hover:bg-[#0a091c]/80 transition-colors duration-300 overflow-hidden h-full"
                  >
                    <div className="relative w-full overflow-hidden">
                      <div className="absolute inset-0 bg-[url('/images/fond-halo.png')] bg-no-repeat bg-center bg-cover opacity-50" />
                      <img
                        src={character.image}
                        alt={character.name}
                        className="relative z-10 w-full h-auto object-contain transition-transform duration-500 group-hover:scale-102"
                      />
                    </div>
                    <div className="px-2 py-3">
                      <h3 className="text-sm font-semibold text-white text-center leading-none mb-1">
                        {character.name}
                      </h3>
                      <p className="text-gray-400 text-sm text-center leading-tight">
                        {roleMapping[Number(character.role)]} <br />
                        {typeMapping[Number(character.type)]}
                      </p>
                    </div>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bouton "Filtrer" en mobile */}
      <div className="lg:hidden fixed bottom-4 left-0 right-0 flex justify-center z-40">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-[#82B0D6] text-[#0a091c] font-semibold py-2 px-6 rounded-full shadow-lg"
        >
          Filtrer
        </button>
      </div>

      {/* Overlay filtres mobile */}
      <div
        className={`fixed inset-0 bg-[#0a091c] z-50 overflow-y-auto p-6 transition-transform duration-300 ease-in-out ${
          showMobileFilters ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Filtres</h2>
          <button
            onClick={() => setShowMobileFilters(false)}
            className="text-white text-sm border border-white/30 px-3 py-1 rounded"
          >
            Fermer
          </button>
        </div>

        {/* Filtres mobiles */}
        <div className="mb-6">
          <label className="mr-2 text-s text-purple-200/80">
            Afficher uniquement les disponibles
          </label>
          <div
            onClick={handleOnlyAvailableToggle}
            className={`relative inline-block w-12 h-6 rounded-full transition-all cursor-pointer ${
              onlyAvailable ? "bg-green-500" : "bg-gray-500"
            }`}
          >
            <div
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                onlyAvailable ? "translate-x-6" : ""
              }`}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Rôle</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(roleMapping).map((key) => {
              const roleId = Number(key);
              return (
                <button
                  key={roleId}
                  onClick={() => toggleRole(roleId)}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    selectedRoles.includes(roleId)
                      ? "border-[#82B0D6]"
                      : "border-white/20"
                  } bg-transparent hover:border-[#82B0D6] transition-all`}
                >
                  {roleMapping[roleId]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Type</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(typeMapping).map((key) => {
              const typeId = Number(key);
              return (
                <button
                  key={typeId}
                  onClick={() => toggleType(typeId)}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    selectedTypes.includes(typeId)
                      ? "border-[#82B0D6]"
                      : "border-white/20"
                  } bg-transparent hover:border-[#82B0D6] transition-all`}
                >
                  {typeMapping[typeId]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharactersPage;
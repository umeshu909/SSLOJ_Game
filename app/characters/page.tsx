"use client";
import { useEffect, useState } from "react";
import { Filter, X, Search } from "lucide-react";
import { XCircle } from "lucide-react";
import IconCanvas from "@/components/IconCanvas";
import { useTranslation } from "react-i18next";

interface Character {
  id: number;
  image: string;
  name: string;
  role: string;
  type: string;
  link: string;
}

const roleIconMapping: Record<number, string> = {
  1: "/images/icons/icon_12g_fang_attack.png", // Tank
  2: "/images/icons/icon_12g_gong_attack.png", // Guerrier
  3: "/images/icons/icon_12g_ji_attack.png",    // Compétence
  4: "/images/icons/icon_12g_ci_attack.png",    // Assassin
  5: "/images/icons/icon_12g_fu_attack.png",    // Support
};


const typeIconMapping: Record<number, string> = {
  1: "/images/icons/sds_shenqi_shui.png", // Eau
  2: "/images/icons/sds_shenqi_huo.png",   // Feu
  3: "/images/icons/sds_shenqi_feng.png",  // Vent
  4: "/images/icons/sds_shenqi_tu.png",    // Terre
  5: "/images/icons/sds_shenqi_guang.png", // Lumière
  6: "/images/icons/sds_shenqi_an.png",    // Ombre
};


const invocationTypeMapping: Record<string, string> = {
  Sablier: "sds_aodexiusi_shikongzhixi",
  Petale: "sds_huaban_fen",
  p2w: "sds_cishanmujuan_wp",
  Stellaire: "sds_migongbi_icon",
  Fleche: "sds_xindoushiup_wp",
  Bouclier: "sds_xindoushiup_dun_wp",
};


// Fonction pour retirer les accents des lettres
const normalizeString = (str: string) =>
  str.normalize("NFD").replace(/\p{Diacritic}/gu, "");

const CharactersPage = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [selectedInvocation, setSelectedInvocation] = useState<string>("");
  const [lang, setLang] = useState("FR");
  const { t } = useTranslation("common");

  const typeMapping: Record<number, string> = {
    1: t("types.Eau"),
    2: t("types.Feu"),
    3: t("types.Vent"),
    4: t("types.Terre"),
    5: t("types.Lumière"),
    6: t("types.Ombre")
  };

  const roleMapping: Record<number, string> = {
    1: t("roles.Tank"),
    2: t("roles.Guerrier"),
    3: t("roles.Compétence"),
    4: t("roles.Assassin"),
    5: t("roles.Support")
  };

  const invocationLabelMapping: Record<string, string> = {
    p2w: t("invocation.p2w"),
    Stellaire: t("invocation.Stellaire"),
    Sablier: t("invocation.Sablier"),
    Petale: t("invocation.Petale"),
    Fleche: t("invocation.Fleche"),
    Bouclier: t("invocation.Bouclier"),
  };

  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang) {
      setLang(storedLang);
    }
  }, []);

  useEffect(() => {
    if (!lang) return; // attend que lang soit défini
    fetchCharacters();
  }, [selectedRoles, selectedTypes, searchQuery, onlyAvailable, selectedInvocation, lang]);


  const fetchCharacters = async () => {
    const lang = localStorage.getItem("lang") || "FR";
    const res = await fetch(
      `/api/characters?role=${selectedRoles.join(",")}&type=${selectedTypes.join(",")}&searchQuery=${searchQuery}&onlyAvailable=${onlyAvailable}&invocation=${selectedInvocation}`,
      {
        headers: {
          "x-db-choice": lang,
        },
      }
    );


    const data = await res.json();
    if (Array.isArray(data)) {
      setCharacters(data.reverse());
    } else {
      setCharacters([]);
    }
  };

  useEffect(() => {
    if (!lang) return; // attend que lang soit défini
    fetchCharacters();
  }, [selectedRoles, selectedTypes, searchQuery, onlyAvailable, selectedInvocation, lang]);



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
    const rawValue = event.target.value;
    const normalized = normalizeString(rawValue);
    setSearchQuery(normalized);
  };

  const handleOnlyAvailableToggle = () => {
    setOnlyAvailable((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white relative pb-20">
      {/* Recherche mobile */}
      <div className="lg:hidden w-full px-4 my-4 relative">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          placeholder={t("interface.searchCharacter")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-purple-300/10 border rounded pl-10 pr-4 py-3 border-transparent text-sm focus:outline-none focus:border-purple-300/30 focus:border focus:bg-purple-300/15 w-full text-white hover:bg-purple-300/15 transition-all duration-300 ease-in-out"
        />
      </div>

      <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-[12px]">
        {/* Filtres desktop */}
        <div className="hidden lg:flex flex-col w-[320px] sticky top-[132px] h-fit bg-[#14122a] p-6 text-white">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t("interface.filters")}</h2>
              {/* Annulation des filtres */}
              {(selectedRoles.length > 0 || selectedTypes.length > 0 || onlyAvailable || searchQuery !== "" || selectedInvocation !== "") && (
              <button
                onClick={() => {
                  setSelectedRoles([]);
                  setSelectedTypes([]);
                  setSearchQuery("");
                  setOnlyAvailable(false);
                  setSelectedInvocation(""); 
                }}
                className="text-white hover:text-red-500 text-xl"
                title={t("interface.initFilters")}
              >
                <span className="text-xs ml-1 inline-flex items-center gap-1 cursor-pointer">
                  {t("interface.initFilters")} <XCircle size={14} className="text-red-500" />
                </span>

              </button>
              )}
            </div>

          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder={t("interface.searchCharacter")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-purple-300/10 border rounded pl-10 pr-4 py-3 border-transparent text-sm focus:outline-none focus:border-purple-300/30 focus:border focus:bg-purple-300/15 w-full text-white hover:bg-purple-300/15 transition-all duration-300 ease-in-out"
            />
          </div>

          <div className="flex items-center mb-6 gap-4">
            <div className="flex-1 text-xs text-white/70 leading-snug">
              {t("interface.onlyAvailable")}
            </div>
            <div
              onClick={handleOnlyAvailableToggle}
              className={`w-[40px] h-6 flex-shrink-0 relative rounded-full transition-all cursor-pointer ${onlyAvailable ? "bg-green-500" : "bg-gray-500"}`}
            >
              <div
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${onlyAvailable ? "translate-x-[16px]" : ""}`}
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase font-medium mb-3 text-white/80">{t("interface.role")}</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(roleMapping).map((key) => {
                const roleId = Number(key);
                return (
                  <button
                    key={roleId}
                    onClick={() => toggleRole(roleId)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer text-sm border transition-all
                      ${selectedRoles.includes(roleId)
                        ? "text-white bg-purple-300/15 border-white/80"
                        : "text-white/70 bg-transparent border-white/40 hover:border-white hover:text-white"}`}
                    >
                    <img
                      src={roleIconMapping[roleId]}
                      alt={roleMapping[roleId]}
                      className="w-6 h-6"
                    />
                    <span className="whitespace-nowrap text-xs">{roleMapping[roleId]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xs uppercase font-medium mb-3 text-white/80">{t("interface.type")}</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(typeMapping).map((key) => {
                const typeId = Number(key);
                return (
                  <button
                    key={typeId}
                    onClick={() => toggleType(typeId)}
                    className={`flex items-center gap-2 px-2 py-1 rounded-full cursor-pointer text-sm border transition-all
                      ${selectedTypes.includes(typeId)
                        ? "text-white bg-purple-300/15 border-white/80"
                        : "text-white/70 bg-transparent border-white/40 hover:border-white hover:text-white"}`}
                    >
                    <img
                      src={typeIconMapping[typeId]}
                      alt={typeMapping[typeId]}
                      className="w-6 h-6"
                    />
                    <span className="whitespace-nowrap text-xs">{typeMapping[typeId]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xs uppercase font-medium mb-3 text-white/80">{t("interface.invocation")}</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(invocationTypeMapping).map(([key, icon]) => (
                <button
                  key={key}
                  onClick={() => setSelectedInvocation(selectedInvocation === key ? "" : key)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer text-sm border transition-all ${
                    selectedInvocation === key
                      ? "text-white bg-purple-300/15 border-white/80"
                      : "text-white/70 bg-transparent border-white/40 hover:border-white hover:text-white"
                  }`}
                >
                <img
                  src={`/images/icons/${key.toLowerCase()}.png`}
                  alt={invocationLabelMapping[key] ?? key}
                  className="w-8 h-8"
                />


                  <span className="whitespace-nowrap text-xs -ml-1">{invocationLabelMapping[key] ?? key}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Grille de personnages */}
        <div className="w-full lg:w-3/4 lg:px-6">
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-3">
            {characters.length === 0 ? (
              <p className="text-center text-lg">{t("errors.noCharacter")}</p>
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
        className={`fixed inset-0 bg-[#0a091c] z-50 overflow-y-auto p-6 transition-transform duration-300 ease-in-out ${showMobileFilters ? "translate-y-0" : "translate-y-full pointer-events-none"
          }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{t("interface.filters")}</h2>
          
          <div className="flex space-x-2">
            {/* Annulation filtres */}
            <button
              onClick={() => {
                  setSelectedRoles([]);
                  setSelectedTypes([]);
                  setSearchQuery("");
                  setOnlyAvailable(false);
                  setSelectedInvocation("");
              }}
              className="text-white hover:text-red-500 text-xl"
              title={t("interface.initFilters")}
            >
              ✕
            </button>
            {/* Bouton Fermer */}
            <button
              onClick={() => setShowMobileFilters(false)}
              className="text-white text-sm border border-white/30 px-3 py-1 rounded"
            >
              {t("interface.close")}
            </button>
          </div>

        </div>

        {/* Filtres mobiles */}
        <div>
            <h3 className="text-xs uppercase font-medium mb-3 text-white/80">{t("interface.role")}</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(roleMapping).map((key) => {
                const roleId = Number(key);
                return (
                  <button
                    key={roleId}
                    onClick={() => toggleRole(roleId)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full cursor-pointer text-sm border transition-all
                      ${selectedRoles.includes(roleId)
                        ? "text-white bg-purple-300/15 border-white/80"
                        : "text-white/70 bg-transparent border-white/40 hover:border-white hover:text-white"}`}
                    >
                    <img
                      src={roleIconMapping[roleId]}
                      alt={roleMapping[roleId]}
                      className="w-6 h-6"
                    />
                    <span className="whitespace-nowrap text-xs">{roleMapping[roleId]}</span>
                  </button> 
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xs uppercase font-medium mb-3 text-white/80">{t("interface.type")}</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(typeMapping).map((key) => {
                const typeId = Number(key);
                return (
                  <button
                    key={typeId}
                    onClick={() => toggleType(typeId)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-sm border transition-all
                      ${selectedTypes.includes(typeId)
                        ? "text-white bg-purple-300/15 border-white/80"
                        : "text-white/70 bg-transparent border-white/40 hover:border-white hover:text-white"}`}
                      >
                    <img
                      src={typeIconMapping[typeId]}
                      alt={typeMapping[typeId]}
                      className="w-6 h-6"
                    />
                    <span className="whitespace-nowrap text-xs">{typeMapping[typeId]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xs uppercase font-medium mb-3 text-white/80">{t("interface.invocation")}</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(invocationTypeMapping).map(([key, icon]) => (
                <button
                  key={key}
                  onClick={() => setSelectedInvocation(selectedInvocation === key ? "" : key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-sm border transition-all ${
                    selectedInvocation === key
                      ? "text-white bg-purple-300/15 border-white/80"
                      : "text-white/70 bg-transparent border-white/40 hover:border-white hover:text-white"
                  }`}
                >
                  <IconCanvas
                    prefix="sactx-0-4096x4096-ASTC 6x6-icon_daojv-"
                    iconName={icon}
                    jsonDir="/images/atlas/icon_daojv/"
                    canvasId={`canvas-filter-mobile-${key}`}
                    imgHeight={4096}
                    size={3}
                  />

                  <span className="whitespace-nowrap text-xs">{invocationLabelMapping[key] ?? key}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center mt-6 gap-4">
            <div className="flex-1 text-sm text-white/70 leading-snug">
              {t("interface.onlyAvailable")}
            </div>
            <div
              onClick={handleOnlyAvailableToggle}
              className={`w-[40px] h-6 flex-shrink-0 relative rounded-full transition-all cursor-pointer ${onlyAvailable ? "bg-green-500" : "bg-gray-500"
                }`}
            >
              <div
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${onlyAvailable ? "translate-x-[16px]" : ""
                  }`}
              />
            </div>
          </div>
        </div>

    </div>
  );
};

export default CharactersPage;
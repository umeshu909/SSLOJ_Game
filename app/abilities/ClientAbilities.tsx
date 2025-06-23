// Page React/Next.js (App Router) pour gérer les aptitudes des personnages
"use client";

import { useEffect, useState } from "react";

export default function CharacterAbilitiesManager() {
  const [characters, setCharacters] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characterAbilities, setCharacterAbilities] = useState([]);
  const [newAbilityName, setNewAbilityName] = useState("");
  const [newAbilityDesc, setNewAbilityDesc] = useState("");
  const [newAbilityCategory, setNewAbilityCategory] = useState("OTHERS");


  useEffect(() => {
    fetch("/api/characters/list")
      .then(res => res.json())
      .then(setCharacters);

    fetch("/api/abilities")
      .then(res => res.json())
      .then(setAbilities);
  }, []);

  useEffect(() => {
    if (selectedCharacter) {
      fetch(`/api/characters/${selectedCharacter}/abilities`)
        .then(res => res.json())
        .then(data => {
          console.log("Aptitudes reçues :", data); // 👈 ICI
          if (Array.isArray(data)) {
            setCharacterAbilities(data);
          } else {
            setCharacterAbilities([]);
          }
        })
        .catch(() => setCharacterAbilities([]));
    }
  }, [selectedCharacter]);



  const toggleAbility = async (abilityId, enabled) => {
    if (!selectedCharacter) return;

    await fetch(`/api/characters/${selectedCharacter}/abilities`, {
      method: enabled ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ abilityId }),
    });

    // Recharger proprement depuis la base après modification
    const res = await fetch(`/api/characters/${selectedCharacter}/abilities`);
    const data = await res.json();
    setCharacterAbilities(Array.isArray(data) ? data : []);
  };


  const addAbility = async () => {
    if (!newAbilityName || !newAbilityDesc) return;
    const res = await fetch("/api/abilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newAbilityName, description: newAbilityDesc, category: newAbilityCategory }),
    });
    const newAb = await res.json();
    setAbilities(prev => [...prev, newAb]);
    setNewAbilityName("");
    setNewAbilityDesc("");

  };

  return (
    <div className="flex gap-6 p-4 text-white bg-slate-900 min-h-screen">
      <div className="w-1/4 border-r border-slate-700 pr-4 overflow-y-auto max-h-[80vh]">
        <h2 className="font-bold mb-2 text-gray-100">Personnages</h2>
        <ul className="space-y-1">
          {characters.map((char) => (
            <li
              key={char.id}
              onClick={() => setSelectedCharacter(char.id)}
              className={`cursor-pointer p-1 rounded ${
                selectedCharacter === char.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-700 text-gray-300"
              }`}
            >
              {char.name} - {char.firstname}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4">
        <h2 className="font-bold mb-4 text-gray-100">Aptitudes disponibles</h2>

        <div className="space-y-6 mb-6">
          {["ATK", "DEF", "CONTROL", "CAPACITY", "EFFECT", "OTHERS"].map((cat) => (
            <div key={cat}>
              <h4 className="text-xm font-bold text-white mb-2">{cat}</h4>
              <div className="grid grid-cols-4 gap-2">
                {abilities
                  .filter((ab) => ab.category === cat)
                  .map((ab) => (
                    <label key={ab.id} className="flex items-center space-x-2 text-gray-200">
                      <input
                        type="checkbox"
                        checked={characterAbilities.includes(ab.id)}
                        onChange={(e) => toggleAbility(ab.id, e.target.checked)}
                        className="accent-blue-500"
                      />
                      <span className="text-xs">{ab.description}</span>
                    </label>
                  ))}
              </div>
            </div>
          ))}
        </div>


        <div className="border-t border-slate-700 pt-4">
          <h3 className="font-semibold mb-2 text-gray-100">Ajouter une nouvelle aptitude</h3>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Nom technique (ex: stun, heal...)"
                value={newAbilityName}
                onChange={(e) => setNewAbilityName(e.target.value)}
                className="border border-slate-600 bg-slate-800 text-white p-1 rounded"
              />
              <input
                type="text"
                placeholder="Description visible (ex: Étourdissement)"
                value={newAbilityDesc}
                onChange={(e) => setNewAbilityDesc(e.target.value)}
                className="border border-slate-600 bg-slate-800 text-white p-1 rounded"
              />
              <select
                value={newAbilityCategory}
                onChange={(e) => setNewAbilityCategory(e.target.value)}
                className="border border-slate-600 bg-slate-800 text-white p-1 rounded"
              >
                <option value="ATK">ATK</option>
                <option value="DEF">DEF</option>
                <option value="CONTROL">CONTROL</option>
                <option value="CAPACITY">CAPACITY</option>
                <option value="EFFECT">EFFECT</option>
                <option value="OTHERS">OTHERS</option>
              </select>
              <button
                onClick={addAbility}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                Ajouter
              </button>
            </div>


        </div>
      </div>
    </div>

  );
}

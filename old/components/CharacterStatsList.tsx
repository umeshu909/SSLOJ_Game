import React from "react";
import { Character } from "@/types/character";

interface Props {
  character: Character;
}

const CharacterStatsList: React.FC<Props> = ({ character }) => {

  return (
    <ul className="text-sm text-white space-y-1">
      {Object.entries(character.release).map(([label, value]) => (
        <li key={label} className="flex items-center gap-2">
          <span className="text-sm text-white/60">{label}:</span>
          <span className="font-text-white font-medium text-cosmosCrystal/30">{value}</span>
        </li>
      ))}
      {Object.entries(character.stats).map(([label, value]) => (
        <li key={label} className="flex items-center gap-2">
          <span className="text-sm text-white/60">{label}:</span>
          <span className="font-text-white font-medium text-cosmosCrystal/30">{value}</span>
        </li>
      ))}
    </ul>
  );
};

export default CharacterStatsList;
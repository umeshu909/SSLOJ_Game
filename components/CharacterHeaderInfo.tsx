import React from "react";
import { Character } from "@/types/character";

interface Props {
  character: Character;
}

const CharacterHeaderInfo: React.FC<Props> = ({ character }) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <img
        src={character.image}
        alt={character.name}
        className="w-24 h-32 rounded-lg object-cover border border-white/10"
      />
      <div>
        <h1 className="text-xl font-bold leading-tight">
          {character.name} [{character.firstname}]
        </h1>
        <p className="text-cosmosCrystal text-sm">
          {character.element} • {character.role}
        </p>
      </div>
    </div>
  );
};

export default CharacterHeaderInfo;
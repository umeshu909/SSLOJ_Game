import React from "react";
import { Character } from "@/types/character";
import CharacterHeaderInfo from "@/components/CharacterHeaderInfo";
import CharacterStatsList from "@/components/CharacterStatsList";

interface SidebarProps {
  character: Character;
}

const CharacterSidebar: React.FC<SidebarProps> = ({ character }) => {
  return (
    <aside className="hidden lg:flex flex-col w-[320px] sticky top-0 h-fit bg-[#14122a] rounded-xl p-6 text-white">
      <CharacterHeaderInfo character={character} />
      <div className="mt-2">
        <CharacterStatsList character={character} />
      </div>
    </aside>
  );
};

export default CharacterSidebar;
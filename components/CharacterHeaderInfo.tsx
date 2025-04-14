import React from "react";
import { Character } from "@/types/character";
import IconCanvas from "@/components/IconCanvas";

interface Props {
  character: Character;
}

const categoryImages = {
  Compétence: "icon_12g_ji_attack.png",
  Guerrier: "icon_12g_gong_attack.png",
  Support: "icon_12g_fu_attack.png",
  Assassin: "icon_12g_ci_attack.png",
  Tank: "icon_12g_fang_attack.png"
};
const typesImages = {
  Eau: "sds_shenqi_shui.png",
  Feu: "sds_shenqi_huo.png",
  Vent: "sds_shenqi_feng.png",
  Terre: "sds_shenqi_tu.png",
  Lumière: "sds_shenqi_guang.png",
  Ombre: "sds_shenqi_an.png"
};

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
          {/*character.element} • {character.role*/}
          <span className="flex items-center gap-3 ml-2">
            <img
              src={`/images/icons/${typesImages[character.element]}`}
              width="32"
              alt={character.element}
            />
            <img
              src={`/images/icons/${categoryImages[character.role]}`}
              width="42"
              alt={character.role}
            />
          </span>
        </p>
      </div>
    </div>
  );
};

export default CharacterHeaderInfo;
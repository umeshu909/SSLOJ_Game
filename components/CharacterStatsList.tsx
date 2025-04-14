import React from "react";
import { Character } from "@/types/character";
import IconCanvas from "@/components/IconCanvas";

interface Props {
  character: Character;
}

const typeIconMapping = {
  Sablier: "sds_aodexiusi_shikongzhixi",
  Petale: "sds_huaban_fen",
  p2w: "sds_cishanmujuan_wp",
  Stellaire: "sds_migongbi_icon",
  Fleche: "sds_xindoushiup_wp",
  Bouclier: "sds_xindoushiup_dun_wp"
};

const CharacterStatsList: React.FC<Props> = ({ character }) => {

  return (
    <ul className="text-sm text-white space-y-1">

      {Object.entries(character.release).map(([label, value]) => {

        return (
          <li key={label} className="flex items-center gap-2">
            <span className="text-sm text-white/60">{label}:</span>

            {label.toLowerCase() === "invocation" && typeIconMapping[value] ? (
              <IconCanvas
                prefix="sactx-0-4096x4096-ASTC 6x6-icon_daojv-"
                iconName={typeIconMapping[value]}
                jsonDir="/images/atlas/icon_daojv/"
                canvasId={`canvas-summon-${value}`}
                imgHeight={4096}
                size={3}
              />
            ) : (
              <span className="font-text-white font-medium text-cosmosCrystal/30">
                {value}
              </span>
            )}
          </li>
        );
      })}

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
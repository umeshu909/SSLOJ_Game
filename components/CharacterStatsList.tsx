import React from "react";
import { Character } from "@/types/character";
import IconCanvas from "@/components/IconCanvas";
import { useTranslation } from 'next-i18next'

interface Props {
  character: Character;
}

const invocationImageMap: Record<string, string> = {
  Sablier: "/images/icons/sablier.png",
  Petale: "/images/icons/petale.png",
  p2w: "/images/icons/p2w.png",
  Stellaire: "/images/icons/stellaire.png",
  Fleche: "/images/icons/fleche.png",
  Bouclier: "/images/icons/bouclier.png",
};


const CharacterStatsList: React.FC<Props> = ({ character }) => {
  const { t } = useTranslation("common");

  return (
    <ul className="text-sm text-white space-y-1">

      {Object.entries(character.release).map(([label, value]) => {

        return (
          <li key={label} className="flex items-center gap-2">
            <span className="text-sm text-white/60">{t(`stat.${label}`)}:</span>

            {invocationImageMap[value] ? (
              <img
                src={invocationImageMap[value]}
                alt={value}
                className="w-10 h-10"
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
          <span className="text-sm text-white/60">{t(`stat.${label}`)}:</span>
          <span className="font-text-white font-medium text-cosmosCrystal/30">{value}</span>
        </li>
      ))}
    </ul>
  );
};

export default CharacterStatsList;
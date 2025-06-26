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


const CharacterAbilities: React.FC<Props> = ({ character }) => {
  const { t } = useTranslation("common");

  return (
    <section className="lg:px-6 pb-6">
      {character.abilities && (
        <>
          <h2 className="text-xl font-semibold text-white mb-2">{t("abilities.abilities")}</h2>

          <div className="overflow-hidden">
            <div className="flex flex-col bg-white/5 p-6 border border-white/20 rounded-xl items-center justify-center">
              <div className="flex flex-wrap gap-2 mt-1">
                {character.abilities.split(',').map((key) => (
                  <span
                    key={key.trim()}
                    className="bg-white/10 text-white text-xs px-3 py-1 rounded-full border border-white/20"
                  >
                    {t(`abilities.${key.trim()}`)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};


export default CharacterAbilities;
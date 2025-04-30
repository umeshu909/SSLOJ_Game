import React, { useState } from "react";
import { Character } from "@/types/character";
import IconCanvas from "@/components/IconCanvas";
import { Image, Link as LinkIcon, Star, Shield, Swords } from "lucide-react";

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
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex items-start gap-4 mb-4">
      {/* Colonne image + icônes */}
      <div className="flex flex-col items-center">
        <img
          src={character.image}
          alt={character.name}
          className="w-24 h-32 rounded-lg object-cover object-top border border-white/10"
        />
        <div className="flex items-center gap-2 mt-2">
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
        </div>
      </div>

      {/* Nom et liens */}
      <div className="flex flex-col items-start">
        <h1 className="text-xl font-bold leading-tight">
          {character.name} [{character.firstname}]
        </h1>

        {/* Liens icônes */}
        <div className="flex gap-4 mt-2 text-white/80">
          <a href="#skills" title="Compétences">
            <Swords size={20} />
          </a>
          <a href="#armor" title="Armure">
            <Shield size={20} />
          </a>
          <a href="#constellation" title="Constellation">
            <Star size={20} />
          </a>
          <a href="#links" title="Liens">
            <LinkIcon size={20} />
          </a>
          <button title="Image en grand" onClick={() => setShowModal(true)}>
            <Image size={20} />
          </button>
        </div>

        {/* Modale image agrandie */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center pt-24"
            onClick={() => setShowModal(false)}
          >
            {/* Conteneur pour image + bouton */}
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Bouton Fermer */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-0 right-0 text-white bg-black/60 hover:bg-black/80 p-2 rounded-bl-md"
                title="Fermer"
              >
                ✕
              </button>

              {/* Image en grand */}
              <img
                src={character.image2}
                alt={character.name}
                className="max-h-[80vh] max-w-[90vw] rounded-lg border border-white/20"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CharacterHeaderInfo;

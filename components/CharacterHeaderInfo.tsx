import React, { useState, useRef, useEffect } from "react";

import { Character } from "@/types/character";
import IconCanvas from "@/components/IconCanvas";
import { Image, Link as LinkIcon, Star, Shield, Swords } from "lucide-react";
import SparkleOverlay from "@/components/SparkleOverlay"; 
import { FastAverageColor } from "fast-average-color";


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

  const [dominantColor, setDominantColor] = useState<string>("#FFD700");
  const imgRef = useRef<HTMLImageElement>(null);
  const fac = new FastAverageColor();

  useEffect(() => {
    if (!showModal || !imgRef.current) return;

    const fac = new FastAverageColor();
    fac.getColorAsync(imgRef.current)
      .then((color) => {
        setDominantColor(color.hex); // ou color.rgba
      })
      .catch((e) => {
        console.warn("Color extraction failed", e);
        setDominantColor("#FFD700"); // fallback doré
      });
  }, [showModal]);

  return (
    <div className="flex items-start gap-4 mb-4">
      {/* Colonne image + icônes */}
      <div className="flex flex-col items-center">
      
        <div className="border-animated-gradient p-[2px] rounded-lg">
          <img
            src={character.image}
            alt={character.name}
            className="w-24 h-32 rounded-lg object-cover object-top"
          />
        </div>


        <div className="hidden sm:flex items-center gap-2 mt-2">
          <img src={`/images/icons/${typesImages[character.element]}`} width="32" alt={character.element} />
          <img src={`/images/icons/${categoryImages[character.role]}`} width="42" alt={character.role} />
        </div>

      </div>

      {/* Nom et liens */}
      <div className="flex flex-col items-start">
        <h1 className="text-xl font-bold leading-tight">
          <span className="sm:block">{character.name}</span>
          <span className="sm:block sm:mt-1 sm:text-base sm:text-white/70">
            <span className="sm:hidden"> </span>[{character.firstname}]
          </span>
        </h1>

        {/* Version visible uniquement en mobile (<sm) */}
        <div className="flex items-center gap-2 mt-2 sm:hidden">
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


        {/* Liens icônes */}
         <div
            className={`
              flex gap-4 text-white/80
              mt-2
              sm:mt-2 sm:static
              fixed bottom-0 left-0 right-0 z-50 bg-black/80 py-2 justify-center
              sm:justify-start sm:bg-transparent
            `}
          >

          <a href="#skills" title="Compétences" className="cursor-pointer">
            <Swords size={20} />
          </a>
          <a href="#armor" title="Armure" className="cursor-pointer">
            <Shield size={20} />
          </a>
          <a href="#constellation" title="Constellation" className="cursor-pointer">
            <Star size={20} />
          </a>
          <a href="#links" title="Liens" className="cursor-pointer">
            <LinkIcon size={20} />
          </a>
          <button
            title="Image en grand"
            onClick={() => setShowModal(true)}
            className="cursor-pointer"
          >
            <Image size={20} />
          </button>
        </div>


        {/* Modale image agrandie */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 bg-black/90 pt-[172px] pb-6 px-4 flex items-center justify-center"
            onClick={() => setShowModal(false)}
          >
            <div
              className="relative max-h-[calc(100vh-172px-24px)] max-w-screen overflow-hidden rounded-lg border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 z-10 text-white bg-black/60 hover:bg-black/80 p-2 rounded-full"
                title="Fermer"
              >
                ✕
              </button>

              <div className="relative w-auto max-w-full h-[calc(100vh-172px-24px)] flex items-center justify-center">
                <img
                  ref={imgRef}
                  src={character.image2}
                  alt={character.name}
                  crossOrigin="anonymous"
                  className="h-full w-auto object-contain rounded-lg animate-imagePulse"
                />

                <SparkleOverlay color={dominantColor} />
              </div>

            </div>
          </div>
        )}




      </div>
    </div>
  );
};

export default CharacterHeaderInfo;

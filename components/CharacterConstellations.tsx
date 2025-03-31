import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Utilisation de useParams pour récupérer l'ID dynamique
import IconCanvas from "@/components/IconCanvas"; // Importation du composant IconCanvas

interface ConstellationSkill {
  skillId: string;
  skillDescription: string;
  suitNeed: number; // suitNeed représente le niveau de constellation (3, 9, etc.)
  icon: string; // Icon pour chaque niveau de constellation
}

interface Constellation {
  overname: string;
  icon: string;
  skills: ConstellationSkill[];
}

const ConstellationsPage = () => {
  const params = useParams(); // Récupère les paramètres dynamiques de l'URL
  const id = params?.id as string | undefined; // Assurez-vous que l'ID est bien récupéré
  const [constellationData, setConstellationData] = useState<Constellation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Définir le préfixe pour les icônes de constellation
  const prefix = "sactx-0-4096x2048-ASTC 6x6-icon_jineng-";

  useEffect(() => {
    if (!id) return; // Si l'ID est manquant, on arrête l'exécution

    const fetchConstellations = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/characters/${id}/constellations`); // On envoie une requête à l'API
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des constellations");
        }
        const data = await res.json(); // On récupère les données de constellations
        setConstellationData(data);
      } catch (err: any) {
        setError(err.message); // En cas d'erreur, on la récupère
      } finally {
        setLoading(false); // On arrête de charger une fois la récupération terminée
      }
    };

    fetchConstellations();
  }, [id]); // Ce useEffect se déclenche à chaque changement d'ID

  // Fonction pour afficher les images de constellations en fonction de suitNeed
  const renderSuitNeedImages = (suitNeed: number) => {
    const yellowImages = [];
    const redImages = [];

    if (suitNeed === 3) {
      // Afficher 3 images rouges d'abord, puis 7 images jaunes
      for (let i = 0; i < 3; i++) {
        redImages.push(
          <img
            key={`red-${i}`}
            src="/images/const-active.png"
            alt="Red Constellation"
            className="object-contain"
          />
        );
      }
      for (let i = 0; i < 6; i++) {
        yellowImages.push(
          <img
            key={`yellow-${i}`}
            src="/images/const-inactive.png"
            alt="Yellow Constellation"
            className="object-contain"
          />
        );
      }
    } else if (suitNeed === 9) {
      // Afficher 9 images rouges
      for (let i = 0; i < 9; i++) {
        redImages.push(
          <img
            key={`red-${i}`}
            src="/images/const-active.png"
            alt="Red Constellation"
            className="object-contain"
          />
        );
      }
    }

    return (
      <div className="flex space-x-1 mb-4 justify-center">
        {redImages}
        {yellowImages}
      </div>
    );
  };

  // Fonction pour rendre la description avec HTML intégré
  const renderDescription = (description: string) => {
    return <span dangerouslySetInnerHTML={{ __html: description }} />;
  };

  if (loading) return <div>Chargement des constellations...</div>; // Afficher pendant le chargement
  if (error) return <div>{error}</div>; // Afficher l'erreur s'il y en a

  return (
    <section className="lg:p-6">
      <h2 className="text-2xl font-semibold text-white mb-2">Constellations</h2>
      <div className=" overflow-hidden">
        {/* Liste des compétences de constellation */}
        {constellationData?.skills && constellationData.skills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {constellationData.skills.map((skill, index) => (
              <div key={index} className="flex flex-col bg-white/5 p-6 border border-white/20 rounded-xl items-center justify-center">
                {/* Bloc gauche - icône et nom de la constellation */}
                <div className="flex flex-col items-center justify-center mb-4">
                  <div className="mb-2">
                    <IconCanvas
                      prefix={prefix} // Le préfixe du dossier des icônes
                      iconName={skill.icon} // L'icône de la constellation récupérée depuis l'API
                      jsonDir="/images/atlas/icon_jineng/" // Le dossier où sont stockées les images JSON
                      canvasId={`canvas-${index}`} // Un identifiant unique pour chaque icône
                      imgHeight={2048} // Taille de l'image à afficher
                      size={1} // Taille réduite de l'image, ajustée pour un affichage plus petit
                    />
                  </div>
                  <h3 className="text-white text-center text-m font-semibold">{skill.skillId}</h3>
                </div>

                {/* Affichage des images de suitNeed */}
                {renderSuitNeedImages(skill.suitNeed)}

                {/* Bloc droit - description et niveau */}
                <div className="flex-1 flex flex-col justify-between text-center md:text-left">
                  {/* Description avec interprétation HTML */}
                  <p className="mt-2 text-sm text-white">{renderDescription(skill.skillDescription)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucune compétence de constellation disponible.</p>
        )}
      </div>
    </section>
  );
};

export default ConstellationsPage;
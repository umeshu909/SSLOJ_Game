import React, { useEffect, useRef, useState } from "react";
import { loadImage, loadJSON, getImageSrc } from "@/utils/imageUtils";

interface IconCanvasProps {
  prefix: string;
  iconName: string;
  jsonDir: string;
  canvasId: string;
  imgHeight: number;
  size?: number;
}

const IconCanvas: React.FC<IconCanvasProps> = ({
  prefix,
  iconName,
  jsonDir,
  canvasId,
  imgHeight,
  size = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function drawIcon() {
      try {
        // Log pour vérifier le préfixe
        console.log("Préfixe de l'icône:", prefix);

        // Appeler getImageSrc pour obtenir l'image
        const imageSrc = await getImageSrc(prefix);

        // Vérification si l'image est trouvée
        if (!imageSrc) {
          console.error("Image introuvable pour le préfixe :", prefix);
          return;
        }

        // Charger le fichier JSON associé à l'icône
        const jsonSrc = `${jsonDir}${iconName}.json`;
        console.log(jsonSrc);  // Log pour vérifier le chemin du fichier JSON
        const jsonData = await loadJSON(jsonSrc);

        // Extraire les coordonnées de l'icône à partir du JSON
        const { m_Rect } = jsonData;
        const x = m_Rect.m_X;
        const y = imgHeight - m_Rect.m_Y - m_Rect.m_Height;
        const width = m_Rect.m_Width;
        const height = m_Rect.m_Height;

        // Charger l'image
        const img = await loadImage(imageSrc);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Désactiver le lissage pour éviter le flou
        ctx.imageSmoothingEnabled = false;

        // Ajuster la taille du canvas en fonction de la taille demandée
        const newWidth = width / size;
        const newHeight = height / size;
        const ratio = window.devicePixelRatio || 1;

        canvas.width = newWidth * ratio;
        canvas.height = newHeight * ratio;
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;

        // Appliquer le ratio pour éviter la perte de qualité
        ctx.scale(ratio / size, ratio / size);

        // Dessiner l'image découpée sur le canvas
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        setLoaded(true);
      } catch (err) {
        console.error(`Erreur lors du chargement de l'icône: ${iconName}`, err);
      }
    }

    // Appeler la fonction pour dessiner l'icône
    drawIcon();
  }, [prefix, iconName, jsonDir, imgHeight, size]);

  return (
    <canvas
      id={canvasId}
      ref={canvasRef}
      className={`icon-canvas ${loaded ? "loaded" : "loading"}`}
    />
  );
};

export default IconCanvas;
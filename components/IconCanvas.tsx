import React, { useEffect, useRef, useState } from "react";
import { loadImage, loadJSON, getImageSrc } from "@/utils/imageUtils";

interface IconCanvasProps {
  prefix: string;
  iconName: string;
  jsonDir: string;
  canvasId: string;
  imgHeight: number;
  size?: number;
  className?: string;
  id?: string;
}

const IconCanvas: React.FC<IconCanvasProps> = ({
  prefix,
  iconName,
  jsonDir,
  canvasId,
  imgHeight,
  size = 1,
  className,
  id = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function drawIcon() {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.imageSmoothingEnabled = false;

        const ratio = window.devicePixelRatio || 1;
        let usedDirectImage = false;

        if (id) {
          const testImg = new Image();
          const testSrc = `/images/avatar_rounded/${id}.png`;
          const imageExists = await new Promise<boolean>((resolve) => {
            testImg.onload = () => resolve(true);
            testImg.onerror = () => resolve(false);
            testImg.src = testSrc;
          });

          if (imageExists) {
            size = size * 1.1;
            const img = await loadImage(testSrc);
            const newWidth = (img.width / size);
            const newHeight = (img.height / size);

            canvas.width = newWidth * ratio;
            canvas.height = newHeight * ratio;

            if (!className) {
              canvas.style.width = `${newWidth}px`;
              canvas.style.height = `${newHeight}px`;
            }

            ctx.scale(ratio / size, ratio / size);
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

            setLoaded(true);
            usedDirectImage = true;
          } 
        }

        if (!usedDirectImage) {
          const imageSrc = await getImageSrc(prefix);
          if (!imageSrc) {
            console.error("Image introuvable pour le préfixe :", prefix);
            return;
          }

          const jsonSrc = `${jsonDir}${iconName}.json`;
          const jsonData = await loadJSON(jsonSrc);

          const { m_Rect } = jsonData;
          const x = m_Rect.m_X;
          const y = imgHeight - m_Rect.m_Y - m_Rect.m_Height;
          const width = m_Rect.m_Width;
          const height = m_Rect.m_Height;

          const img = await loadImage(imageSrc);
          const newWidth = width / size;
          const newHeight = height / size;

          canvas.width = newWidth * ratio;
          canvas.height = newHeight * ratio;

          if (!className) {
            canvas.style.width = `${newWidth}px`;
            canvas.style.height = `${newHeight}px`;
          }

          ctx.scale(ratio / size, ratio / size);
          ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

          setLoaded(true);
        }
      } catch (err) {
        console.error(`Erreur lors du chargement de l'icône: ${id || iconName}`, err);
      }
    }

    drawIcon();
  }, [prefix, iconName, jsonDir, imgHeight, size, className, id]);

  return (
    <canvas
      id={canvasId}
      ref={canvasRef}
      className={`icon-canvas ${loaded ? "loaded" : "loading"} ${className || ""}`}
    />
  );
};

export default IconCanvas;

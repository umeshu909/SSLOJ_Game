"use client";
import { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
  char: string;
}

interface SparkleOverlayProps {
  color?: string;
}

const sparkleChars = ["✦", "✧", "★", "✺"]; // étoiles variées

const SparkleOverlay = ({ color = "#FFD700" }: SparkleOverlayProps) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const sparkleCount = Math.floor(Math.random() * 15) + 2; // 2 à 5
      const newSparkles: Sparkle[] = Array.from({ length: sparkleCount }).map((_, i) => ({
        id: Date.now() + i,
        top: Math.random() * 100,
        left: 20 + Math.random() * 70, // limité entre 10% et 90%
        size: Math.random() * 2 + 7,
        duration: Math.random() * 0.2 + 3,
        char: sparkleChars[Math.floor(Math.random() * sparkleChars.length)],
      }));


      setSparkles((prev) => [...prev, ...newSparkles]);

      // Retire les anciens scintillements
      setTimeout(() => {
        const now = Date.now();
        setSparkles((prev) => prev.filter((s) => now - s.id < 4000));
      }, 4000);
    }, 800); // apparition toutes les 0.8s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute text-[10px] animate-sparkle select-none"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            fontSize: `${s.size}px`,
            color,
            animationDuration: `${s.duration}s`,
            opacity: 0.9,
          }}
        >
          {s.char}
        </span>
      ))}
    </div>
  );
};

export default SparkleOverlay;

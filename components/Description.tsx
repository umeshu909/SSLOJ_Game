"use client";
import { useEffect, useState } from "react";

interface Props {
  text: string;
  dbChoice?: string;
}

const Description = ({ text, dbChoice = "FR" }: Props) => {
  const [parsed, setParsed] = useState<string>("Chargement...");

  useEffect(() => {
    const fetchParsed = async () => {
      try {
        // Appel vers ton nouvel endpoint "skills/parse"
        const res = await fetch("/api/skills/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, dbChoice })
        });

        const json = await res.json();
        let parsedText = json.result || "Erreur lors du parsing";

        // Appliquer la coloration des % et des crochets ici (si ton API ne le fait pas déjà)
        parsedText = parsedText
          .replace(/(\d+([.,]\d+)?[\s\u00A0]*%)/g, '<span style="color: lightgreen;">$1</span>')
          .replace(/\[(.*?)\]/g, '<span style="color: orange;">[$1]</span>');

        setParsed(parsedText);
      } catch (err) {
        console.error("Erreur parsing:", err);
        setParsed("Erreur lors du chargement de la description");
      }
    };

    fetchParsed();
  }, [text, dbChoice]);

  return <p dangerouslySetInnerHTML={{ __html: parsed }} />;
};

export default Description;
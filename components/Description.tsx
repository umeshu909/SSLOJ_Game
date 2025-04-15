"use client";
import { useEffect, useState } from "react";

interface Props {
  text: string;
  dbChoice?: string;
}

const Description = ({ text, dbChoice = "FR" }: Props) => {
  const [parsed, setParsed] = useState<string>("Chargement...");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "FR";
    const fetchParsed = async () => {
      try {
        // Appel vers ton nouvel endpoint "skills/parse"
        const res = await fetch("/api/skills/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json",  "x-db-choice": lang },
          body: JSON.stringify({ text, dbChoice })
        });

        const json = await res.json();
        let parsedText = json.result || "Erreur lors du parsing";

        // Appliquer la coloration des % et des crochets ici (si ton API ne le fait pas déjà)
        parsedText = parsedText
          .replace(/(\d+([.,]\d+)?[\s\u00A0]*%)/g, '<span style="color: lightgreen;">$1</span>')
          .replace(/(\d+(?:[.,]\d+)?)(?=\s*(secondes?|seconde|sec|couches?|points?|fois?)\b|s\b)/gi, '<span style="color: #82B0D6;">$1</span>')
          .replace(/\\n/g, '<br/>')
          .replace(/(^|<br\/?>)(\s*[A-Za-zÀ-ÿ\-]{4,15})\s*:/g, '$1<span class="text-purple-200">$2:</span>')
          .replace(/\[(.*?)\]/g, '<span style="color: orange;">[$1]</span>');

        setParsed(parsedText);
      } catch (err) {
        console.error("Erreur parsing:", err);
        setParsed("Erreur lors du chargement de la description");
      }
    };

    fetchParsed();
  }, [text, dbChoice]);

  return <p className="inline" dangerouslySetInnerHTML={{ __html: parsed }} />;

};

export default Description;
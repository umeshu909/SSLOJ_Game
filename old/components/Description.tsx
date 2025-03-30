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
                const res = await fetch("/api/parse-description", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ desc: text, dbChoice })
                });

                const json = await res.json();
                setParsed(json.parsed || "Erreur lors du parsing");
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

"use client";

import React, { useEffect, useState } from "react";

const sections = [
    { id: "skills", label: "Skills" },
    { id: "armor", label: "Cloth" },
    { id: "constellations", label: "Constellations" },
    { id: "links", label: "Links" },
];

const CharacterNavigation: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>("skills");

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-25% 0px -50% 0px", // légère marge vers le haut
            threshold: 0.1, // 10% de visibilité suffit
        };

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    if (id) setActiveSection(id);
                }
            }
        }, observerOptions);

        const elements = sections.map((section) =>
            document.getElementById(section.id)
        );

        elements.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            elements.forEach((el) => {
                if (el) observer.unobserve(el);
            });
        };
    }, []);

    return (
        <nav className="sticky top-[68px] z-30 w-full px-6 py-4 flex flex-wrap gap-2 justify-left backdrop-blur-xl mx-[12px] rounded-md">
            {sections.map((section) => (
                <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`text-m px-3 py-1 rounded transition-all ${activeSection === section.id
                        ? "text-purple-300 font-semibold bg-white/10"
                        : "text-white hover:text-purple-300"
                        }`}
                >
                    {section.label}
                </a>
            ))}
        </nav>
    );
};

export default CharacterNavigation;
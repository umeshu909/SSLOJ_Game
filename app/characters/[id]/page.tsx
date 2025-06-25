"use client";

import CharacterSkills from "@/components/CharacterSkills";
import CharacterArmor from "@/components/CharacterArmor";
import CharacterConstellations from "@/components/CharacterConstellations";
import CharacterLinks from "@/components/CharacterLinks";
import CharacterSidebar from "@/components/CharacterSidebar";
import CharacterHeaderInfo from "@/components/CharacterHeaderInfo";
import CharacterStatsList from "@/components/CharacterStatsList";
import BackButton from "@/components/BackButton";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from 'next-i18next'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import {
    Character,
    Skill,
    Armor,
    Constellation,
    Link,
} from "@/types/character";

export const dynamic = "force-dynamic";

export default function CharacterPage() {
    const params = useParams();
    const id = params?.id;

    const [skills, setSkills] = useState<Skill[]>([]);
    const [armor, setArmor] = useState<Armor | null>(null);
    const [constellations, setConstellations] = useState<Constellation[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [skillsError, setSkillsError] = useState(false);

    const { t } = useTranslation("common");

    useEffect(() => {
        async function fetchCharacterData() {
            try {
                setLoading(true);
                const lang = localStorage.getItem("lang") || "FR";
                const characterResponse = await fetch(`/api/characters/${id}`, {
                    method: "GET",
                    headers: {
                        "X-DB-Choice": lang,
                    },
                });

                console.log(characterResponse);

                if (!characterResponse.ok) {
                    setNotFound(true);
                    return;
                }

                const dataCharacter = await characterResponse.json();
                const character = dataCharacter[id];
                setSelectedCharacter(character);

                const skillsResponse = await fetch(`/api/characters/${id}/skills`, {
                    method: "GET",
                    headers: {
                        "X-DB-Choice": lang,
                    },
                });

                if (!skillsResponse.ok) {
                    console.warn("Compétences non disponibles pour ce personnage");
                    setSkillsError(true);
                    setSkills([]);
                } else {
                    setNotFound(true);
                }

                const dataSkills = await skillsResponse.json();
                if (!dataSkills || dataSkills.Skill1Level1 == null) {
                    //console.error("Erreur : données de compétences incomplètes");
                    setNotFound(true);
                    return;
                }
                                 
                setSkills(dataSkills || []);
                setNotFound(false);
            } catch (error: any) {
                console.error("Erreur lors du chargement des personnages:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchCharacterData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p>{t("interface.loading")}</p>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center text-white p-6">
                {/* TEXTE D'INFORMATION */}
                <div className="hidden md:block py-2 max-w-screen-xl mx-auto">
                    <BackButton fallbackHref="/characters" label={t("backOthers.backToCharacters")}/>
                </div>
                <p className="text-lg mt-4">
                    {t("errors.noCharacter")}
                </p>
            </div>

        );
    }

    return (
        <div className="min-h-screen text-white">
            <div className="hidden md:block py-2 max-w-screen-xl mx-auto">
                <BackButton fallbackHref="/characters" label={t("backOthers.backToCharacters")} />
            </div>
            <main className="py-4 px-4 lg:px-6 lg:py-0">
                {/* Mobile top header */}
                <div className="lg:hidden mb-6">
                    {selectedCharacter && (
                        <CharacterHeaderInfo character={selectedCharacter} />
                    )}
                </div>

                <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto">
                    {/* Sidebar à gauche (desktop uniquement) */}
                    <aside className="hidden lg:block w-[320px] sticky top-[132px] self-start bg-[#14122a] text-white">
                        {selectedCharacter && <CharacterSidebar character={selectedCharacter} />}
                    </aside>

                    {/* Contenu principal */}
                    <div className="flex-1">
                        <section id="skills" className="lg:px-6 pb-4 scroll-mt-24">
                          <CharacterSkills skills={skills} />
                        </section>

                        <section id="armor" className="lg:px-6 pb-4 scroll-mt-24">
                          <CharacterArmor armor={armor} />
                        </section>

                        <section id="constellation" className="lg:px-6 pb-4 scroll-mt-24">
                          <CharacterConstellations constellations={constellations} />
                        </section>

                        <section id="links" className="lg:px-6 pb-4 scroll-mt-24">
                          <CharacterLinks links={links} />
                        </section>



                        {/* Mobile stats list en bas */}
                        <div className="block lg:hidden mt-6 px-4">
                            {selectedCharacter && <CharacterStatsList character={selectedCharacter} />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
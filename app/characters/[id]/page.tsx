"use client";

import CharacterSkills from "@/components/CharacterSkills";
import CharacterArmor from "@/components/CharacterArmor";
import CharacterConstellations from "@/components/CharacterConstellations";
import CharacterLinks from "@/components/CharacterLinks";
import CharacterSidebar from "@/components/CharacterSidebar";
import CharacterHeaderInfo from "@/components/CharacterHeaderInfo";
import CharacterStatsList from "@/components/CharacterStatsList";
import BackButton from "@/components/BackButton";

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
    const [error, setError] = useState<string | null>(null);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

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

                if (!characterResponse.ok) {
                    throw new Error(`Erreur lors de la récupération des données du personnage (code ${characterResponse.status})`);
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
                    throw new Error(`Erreur lors de la récupération des données du personnage (code ${skillsResponse.status})`);
                }

                const dataSkills = await skillsResponse.json();
                setSkills(dataSkills || []);
                setError(null);
            } catch (error: any) {
                console.error("Erreur lors du chargement des personnages:", error);
                setError(error.message || "Erreur inconnue");
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
                <p>Chargement...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white">
            <div className="hidden md:block py-2 max-w-screen-xl mx-auto">
                <BackButton fallbackHref="/characters" label="Retour aux personnages" />
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
                        <section className="lg:px-6 pb-4">
                            <CharacterSkills skills={skills} />
                        </section>

                        <section className="lg:px-6 pb-4">
                            <CharacterArmor armor={armor} />
                        </section>

                        <section className="lg:px-6 pb-4">
                            <CharacterConstellations constellations={constellations} />
                        </section>

                        <section className="lg:px-6 pb-4">
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
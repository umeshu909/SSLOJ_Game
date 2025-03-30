"use client";

import CharacterSkills from "@/components/CharacterSkills";
import CharacterArmor from "@/components/CharacterArmor";
import CharacterConstellations from "@/components/CharacterConstellations";
import CharacterLinks from "@/components/CharacterLinks";
import CharacterSidebar from "@/components/CharacterSidebar";
import CharacterHeaderInfo from "@/components/CharacterHeaderInfo";
import CharacterStatsList from "@/components/CharacterStatsList";

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

                const characterResponse = await fetch(`/api/characters/${id}`, {
                    method: "GET",
                    headers: {
                        "X-DB-Choice": "FR",
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
                        "X-DB-Choice": "FR",
                    },
                });

                if (!skillsResponse.ok) {
                    throw new Error(`Erreur lors de la récupération des données du personnage (code ${skillsResponse})`);
                }

                const dataSkills = await skillsResponse.json();
                const skills = dataSkills || [];
                setSkills(skills || []);

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
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white">
            <main className="py-4 px-6">
                {/* Mobile top header */}
                <div className="lg:hidden px-4 mb-6">
                    {selectedCharacter && (
                        <CharacterHeaderInfo character={selectedCharacter} />
                    )}
                </div>

                <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4">
                    {/* Sidebar à gauche (desktop uniquement) */}
                    <aside className="hidden lg:block w-[320px] sticky top-[96px] self-start bg-[#14122a] text-white">
                        {selectedCharacter && <CharacterSidebar character={selectedCharacter} />}
                    </aside>

                    {/* Contenu principal */}
                    <div className="flex-1">
                        <section >
                            <CharacterSkills skills={skills} />
                        </section>

                        <section >
                            <CharacterArmor armor={armor} />
                        </section>

                        <section >
                            <CharacterConstellations constellations={constellations} />
                        </section>

                        <section >
                            <CharacterLinks links={links} />
                        </section>

                        {/* Mobile stats list en bas */}
                        <div className="block lg:hidden mt-6">
                            {selectedCharacter && <CharacterStatsList character={selectedCharacter} />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

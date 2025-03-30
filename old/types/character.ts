// types/character.ts

export interface Character {
    id: number;
    name: string;
    firstname: string;
    rarity: string;
    element: string;
    role: string;
    image: string;
    stats: Record<string, string | number>;
  }
  
  export interface Skill {
    name: string;
    type: string;
    levels: string[];
    timing?: string;
    image: string;
  
    // Infos de timing optionnelles
    start?: number;
    end?: number;
    delay?: number;
    cooldown?: number;
    regenAttack?: number;
    regenDamage?: number;
  
    // Pour gérer l'icône
    icon?: string;
  }
  
  /*export interface Armor {
    name: string;
    levels: string[];
    stats: { name: string; value: string }[];
    image: string;
  }
  
  export interface Constellation {
    name: string;
    desc: string;
    stars: number;
  }
  
  export interface Link {
    mainIcon: string;
    icons: string[];
    skills: { level: number; desc: string }[];
  }
  */
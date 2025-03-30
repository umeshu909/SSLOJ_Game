import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Sélectionner la base de données en fonction du critère (langue)
export async function openDb(dbChoice: string) {
    // Mapper le choix à un fichier de base de données
    const dbName = `DB_${dbChoice.toUpperCase()}.sqlite`;
    const dbPath = `./databases/${dbName}`;

    try {
        return open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
    } catch (error) {
        console.error(`Erreur lors de l'ouverture de la base de données : ${dbPath}`, error);
        throw error;
    }
}

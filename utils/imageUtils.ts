// Chargement des images
export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
}

// Chargement des fichiers JSON
export async function loadJSON(src: string): Promise<any> {
    const response = await fetch(src);
    if (!response.ok) throw new Error(`Erreur lors du chargement du JSON : ${src}`);
    return response.json();
}

// Recherche de l'image correspondante dans le répertoire
export async function getImageSrc(prefix: string): Promise<string | null> {
    try {
        const response = await fetch('/api/list-texture2d');
        if (!response.ok) throw new Error(`Erreur lors du chargement de l'index des images`);

        const data = await response.json();
        const images: string[] = data.images;

        // Rechercher l'image correspondant au préfixe
        const matchedFile = images.find((filename) => decodeURIComponent(filename).startsWith(prefix));
        return matchedFile ? `/images/Texture2D/${matchedFile}` : null;
    } catch (error) {
        console.error("Erreur lors de la récupération des images :", error);
        return null;
    }
}


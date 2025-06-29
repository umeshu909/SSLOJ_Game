// app/articles/[id]/page.tsx
export const dynamic = "force-dynamic";
import LikeButton from '@/components/LikeButton'; // adapte le chemin si besoin

const API_URL = process.env.PUBLIC_INTERNAL_API_URL || 'http://localhost:8055';
const PUBLIC_URL = process.env.NEXT_PUBLIC_PUBLIC_URL || 'http://localhost:8055';


type Article = {
  id: number;
  user_created: string;
  date_created: string;
  title: string;
  text: string;
  tags: string[];
  images?: string; // ton champ images est juste un ID d'asset
};

function cleanHTML(html: string): string {
  // Supprimer tous les attributs class="..." sans toucher aux autres attributs (src, alt, etc.)
  return html.replace(/ class="[^"]*"/g, '');
}


async function getArticle(id: string): Promise<Article | null> {
  const res = await fetch(`${API_URL}/items/Articles/${id}?fields=*,user_created.first_name,likes,status&filter[status][_eq]=published`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Erreur chargement article :", res.status);
    return null;
  }

  const json = await res.json();
  return json.data || null;
}


function formatDate(dateStr?: string): string {
  if (!dateStr) return "Date inconnue";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type PageProps = {
  params: { id: string };
};

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticle(params.id);

  if (!article) {
    return (
      <div className="text-center text-white py-20">
        <h1 className="text-3xl font-bold">Article non trouvé</h1>
      </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-white">
        {/* Titre */}
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

        {/* Date + Auteur */}
        <div className="flex justify-between items-center text-sm text-white/60 mb-8">
          <span>Publié le {formatDate(article.date_created)}</span>
          <span>Par : {article.user_created?.first_name || "Inconnu"}</span>
        </div>

        {/* Contenu avec image alignée */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Texte */}
          {article.text && (
            <div className="prose prose-invert max-w-none flex-1">
              <div dangerouslySetInnerHTML={{ __html: cleanHTML(article.text) }} />
            </div>

          )}

          {/* Image */}
          {article.images && (
            <div className="flex-shrink-0">
              <img
                src={`${PUBLIC_URL}/assets/${article.images}`}
                alt={article.title}
                className="rounded-lg shadow"
                style={{ maxHeight: "300px", width: "auto" }}
              />
            </div>
          )}
        </div>

        {/* Bouton Like */}
        <div className="mb-8">
          <LikeButton articleId={params.id} initialLikes={article.likes || 0} />
        </div>
      </div>
  );
}

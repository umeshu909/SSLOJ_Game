// app/articles/[slug]/page.tsx
export const dynamic = "force-dynamic"

type ImageFormat = {
  url: string
}

type ImageData = {
  id: number
  url: string
  formats?: {
    small?: ImageFormat
    medium?: ImageFormat
    large?: ImageFormat
    thumbnail?: ImageFormat
  }
}

type Article = {
  id: number
  documentId: string
  title: string
  content: string
  slug: string
  publicationDate?: string
  image?: ImageData[]
  Author?: {
    username: string
  }
}

async function getArticle(documentId: string): Promise<Article | null> {
  const res = await fetch(`http://localhost:1337/api/articles?filters[documentId][$eq]=${documentId}&populate[Author]=*&populate[image]=*`, {
    cache: "no-store",
  })

  const json = await res.json()
  return json.data?.[0] || null
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Date inconnue"
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function ArticleDetail({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  if (!article) {
    return <div className="text-center text-white mt-20">Article introuvable</div>
  }

  const { title, content, image, Author, publicationDate } = article
  const authorName = Author?.username || "Inconnu"

  // Récupérer la première image si disponible
  const firstImage = image && image.length > 0 ? image[0] : null
  const imageUrl = firstImage?.url ? `http://localhost:1337${firstImage.url}` : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white space-y-6">
      <h1 className="text-3xl font-bold text-blue-200">{title}</h1>

      <div className="text-sm text-blue-300 flex justify-between">
        <span>Par {authorName}</span>
        <span>{formatDate(publicationDate)}</span>
      </div>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-72 object-cover rounded-xl"
        />
      )}

      <p className="whitespace-pre-line text-gray-100 mt-4">{content}</p>
    </div>
  )
}

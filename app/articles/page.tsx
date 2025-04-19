// app/articles/page.tsx
export const dynamic = "force-dynamic"

type ImageFormat = {
  url: string
  width: number
  height: number
}

type Image = {
  url: string
  formats?: {
    medium?: ImageFormat
    large?: ImageFormat
    small?: ImageFormat
    thumbnail?: ImageFormat
  }
}

type Article = {
  id: number
  documentId: string
  title: string
  content: string
  slug: string | null
  publicationDate?: string
  image?: Image[]
}

async function getArticles(): Promise<Article[]> {
  const res = await fetch("http://localhost:1337/api/articles?populate=image", {
    cache: "no-store",
  })

  const json = await res.json()
  return json.data || []
}

function getExcerpt(text: string, wordLimit = 50): string {
  const words = text.split(/\s+/)
  return words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "")
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Date inconnue"
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-white">Articles</h1>

      {articles.map((article) => {
        const { documentId, title, content, publicationDate, image } = article
        const imageUrl = image && image.length > 0 ? image[0].url : null

        return (
          <a
            key={documentId}
            href={`/articles/${documentId}`}
            className="block border border-blue-700 rounded-xl p-4 bg-blue-800/60 shadow hover:bg-blue-700 transition-colors space-y-4 text-white"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-blue-200">{title}</h2>
              <span className="text-sm text-blue-300">{formatDate(publicationDate)}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <p className="text-gray-100 flex-1">{getExcerpt(content)}</p>
              {imageUrl && (
                <img
                  src={`http://localhost:1337${imageUrl}`}
                  alt={title}
                  className="w-full md:w-48 h-auto object-cover rounded-lg"
                />
              )}
            </div>
          </a>
        )
      })}
    </div>
  )
}

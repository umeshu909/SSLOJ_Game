import { getAbsoluteMediaUrl } from "@/lib/getAbsoluteMediaUrl"

export function serializeRichText(content: any): string {
  if (!content || typeof content !== "object" || !content.root) return ""

  const traverse = (node: any): string => {
    if (!node) return ""

    switch (node.type) {
      case "root":
        return node.children?.map(traverse).join("") || ""

      case "heading": {
        const level = node.tag?.replace("h", "") || "2"
        const inner = node.children?.map(traverse).join("") || ""
        return `<h${level} class="text-yellow-400 font-bold my-4 text-${level === "1" ? "3xl" : level === "2" ? "2xl" : "xl"}">${inner}</h${level}>`
      }

      case "paragraph": {
        const inner = node.children?.map(traverse).join("") || ""
        return inner.trim() ? `<p class="mb-4 leading-relaxed">${inner}</p>` : ""
      }

      case "text": {
        const text = node.text || ""
        if (node.format === 1) return `<strong>${text}</strong>`
        if (node.format === 2) return `<em>${text}</em>`
        if (node.format === 3) return `<strong><em>${text}</em></strong>`
        return text
      }

      case "list": {
        const tag = node.listType === "bullet" ? "ul" : node.listType === "check" ? "ul" : "ol"
        const className = node.listType === "check" ? "list-none" : tag === "ul" ? "list-disc pl-5 mb-4" : "list-decimal pl-5 mb-4"
        const items = node.children?.map(traverse).join("") || ""
        return `<${tag} class="${className}">${items}</${tag}>`
      }

      case "listitem": {
        const inner = node.children?.map(traverse).join("") || ""
        return `<li class="mb-1">${inner}</li>`
      }

      case "upload": {
        const image = node.value?.url
        const alt = node.value?.alt || ""
        if (image) {
          return `<img src="${getAbsoluteMediaUrl(image)}" alt="${alt}" class="my-6 mx-auto rounded-lg shadow-lg mx-auto max-h-[600px] w-auto" />`
        }
        return ""
      }

      case "blockquote": {
        const inner = node.children?.map(traverse).join("") || ""
        return `<blockquote class="border-l-4 border-yellow-400 pl-4 italic my-4 text-gray-300">${inner}</blockquote>`
      }

      default:
        return ""
    }
  }

  return traverse(content.root)
}
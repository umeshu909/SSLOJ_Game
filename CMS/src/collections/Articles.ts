import type { CollectionConfig } from 'payload'

const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'published', 'createdAt'],
  },
  access: {
    read: () => true,

    create: ({ req }) => {
      if (!req.user) return false
      return req.user.role === 'author' || req.user.role === 'admin'
    },

    update: async ({ req, id }) => {
      if (!req.user || !id) return false
      if (req.user.role === 'admin') return true

      const article = await req.payload.findByID({
        collection: 'articles',
        id: id.toString(),
      })

      return article.author === req.user.id
    },

    delete: ({ req }) => {
      if (!req.user) return false
      return req.user.role === 'admin'
    },
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (!data || !data.title) return ''
            return data.title
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '')
          },
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) => {
            if (siblingData?.published && !value) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}

export default Articles
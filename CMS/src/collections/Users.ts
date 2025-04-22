import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'author'],
      defaultValue: 'author',
      required: true,
    },
    // Tu peux aussi ajouter d'autres champs personnalisés ici si besoin
  ],
}
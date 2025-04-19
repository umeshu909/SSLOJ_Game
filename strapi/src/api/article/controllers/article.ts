import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user
    const data = ctx.request.body.data

    if (user) {
      data.Author = user.id
    }

    if (!data.publicationDate) {
      data.publicationDate = new Date().toISOString()
    }

    ctx.request.body.data = data

    const response = await super.create(ctx)
    return response
  },
  async find(ctx) {
    // Ajoutez les champs à peupler
    ctx.query = {
      ...ctx.query,
      populate: ['image', 'Author'],
    };

    // Appelez la méthode par défaut avec les champs peuplés
    return await super.find(ctx);
  },

}))

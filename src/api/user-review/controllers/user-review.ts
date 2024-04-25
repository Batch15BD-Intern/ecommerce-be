/**
 * user-review controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::user-review.user-review', ({ strapi }) => ({
  async find(ctx) {
    const result = await strapi.entityService.findMany('api::user-review.user-review', {
      filters: {
        users: ctx.state.user.id
      },
      fields: ["rating_value", "comment"],
      populate: {
        media: {
          fields: ["url"]
        },
        order_line: {
          fields: ["id"]
        }
      },
    })
    return { data: result };
  },
  async create(ctx) {
    const { body } = ctx.request
    const Review = await strapi.entityService.create("api::user-review.user-review", {
      data: {
        users: ctx.state.user.id,
        rating_value: body.data.rating_value,
        comment: body.data.comment,
        // media: body.data.media,
        order_line: body.data.order_line
      }
    })
    return { data: Review }
  },
}));

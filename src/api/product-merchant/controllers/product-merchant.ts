/**
 * product-merchant controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::product-merchant.product-merchant', ({ strapi }) => ({
  async find(ctx) {
    const result = await strapi.entityService.findMany('api::product-merchant.product-merchant', {
      fields: ["id", "quantity"],
      populate: {
        product_item: {
          fields: ["price"]
        }
      }

    })
    return { data: result };
  },
}));;

/**
 * discount-code controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::discount-code.discount-code', ({ strapi }) => ({
  async find(ctx) {
    const result = await strapi.entityService.findMany('api::discount-code.discount-code', {

      populate: {
        products: {
          fields: ['name']
        }
      },
      fields: ['discount_code', 'discount_amount', 'expiration_date', 'type']
    })
    return { data: result };
  },
}));

/**
 * user-address controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::user-address.user-address', ({ strapi }) => ({
  async create(ctx) {
    const { body } = ctx.request;
    const userAddressResponse = await strapi.entityService.create('api::user-address.user-address', {
      data: {
        user: ctx.state.user.id,
        address_line_1: body.data.address_line_1,
        address_line_2: body.data.address_line_2,
        city: body.data.city,
        country: body.data.country,
        phone: body.data.phone,
        postal_code: body.data.postal_code

      }
    });
    return { data: userAddressResponse };
  },
}));

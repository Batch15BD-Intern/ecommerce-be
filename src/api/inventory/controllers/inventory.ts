/**
 * A set of functions called "actions" for `inventory`
 */

export default {
  get: async (ctx, next) => {
    try {
      const result = await strapi.entityService.findOne(
        "api::product-merchant.product-merchant",
        ctx.params.id,
        {
          fields: ["id", "quantity"],
        },
      );
      return result;
    } catch (err) {
      ctx.body = err;
    }
  },
};

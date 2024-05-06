/**
 * A set of functions called "actions" for `inventory`
 */

export default {
  get: async (ctx, next) => {
    let totalQuantity = 0
    try {
      const result = await strapi.entityService.findMany(
        "api::product-merchant.product-merchant",
        {
          filters:{
            product_item:{
              id:{
                $eq: ctx.params.id
              }
            }
          },
          fields: ["quantity"],
        },
      );
      for (const q of result)
        totalQuantity += q.quantity
      return  {quantity: totalQuantity};
    } catch (err) {
      ctx.body = err;
    }
  },
};

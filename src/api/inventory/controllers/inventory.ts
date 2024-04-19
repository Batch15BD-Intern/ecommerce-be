/**
 * A set of functions called "actions" for `inventory`
 */

export default {
	get: async (ctx, next) => {
		try {
			const result = await strapi.entityService.findOne(
				"api::product-item.product-item",
				ctx.params.id,
				{
					fields: ["quantity"],
				},
			);
			return result;
		} catch (err) {
			ctx.body = err;
		}
	},
};

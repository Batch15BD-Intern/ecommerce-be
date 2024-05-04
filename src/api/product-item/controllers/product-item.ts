/**
 * product-item controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
	"api::product-item.product-item",
	({ strapi }) => ({
		async find(ctx) {
			const result = await strapi.entityService.findMany(
				"api::product-item.product-item",
				{
					fields: ["price", "name"],
					populate: {
						product: {
							fields: ["id", "name"],
						},
						carts: {
							fields: ["id"],
						},
					},
				},
			);
			return { data: result };
		},
	}),
);

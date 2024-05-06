/**
 * cart controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
	"api::cart.cart",
	({ strapi }) => ({
		async find(ctx) {
			const result = await strapi.entityService.findMany("api::cart.cart", {
				filters: {
					users: ctx.state.user.id,
				},
				populate: {
					product_item: {
						fields: ["price", "name"],
						populate: {
							image: {
								fields: ["formats"],
							},
							product: {
								fields: ["id", "name"],
							},
							product_merchants: {
								fields: ["id"],
								populate: {
									merchant: {
										fields: ["id", "name"],
									},
								},
							},
						},
					},
				},
				fields: ["quantity"],
			});
			return { data: result };
		},

		async create(ctx) {
			const { body } = ctx.request;

			if (body.data.quantity < 1 || !body.data.quantity) {
				return {
					data: null,
					error: {
						status: 400,
						name: "FieldError",
						message: "Quantity must be greater than 0",
					},
				};
			}

			if (!body.data.product_item) {
				return {
					data: null,
					error: {
						status: 400,
						name: "FieldError",
						message: "Product item is required",
					},
				};
			}

			const product_item = await strapi.entityService.findOne(
				"api::product-item.product-item",
				body.data.product_item,
			);
			if (!product_item) {
				return {
					data: null,
					error: {
						status: 404,
						name: "NotFoundError",
						message: "Product item not found",
					},
				};
			}

			const quantity = await strapi.entityService.findMany(
				"api::product-merchant.product-merchant",
				{
					filters: {
						product_item: {
							id: {
								$eq: product_item.id,
							},
						},
					},
					fields: ["quantity"],
				},
			);

			if (quantity < body.data.quantity) {
				return {
					data: null,
					error: {
						status: 400,
						name: "FieldError",
						message: "Quantity is not enough",
					},
				};
			}

			const response = await strapi.entityService.create("api::cart.cart", {
				data: {
					quantity: body.data.quantity,
					product_item: body.data.product_item,
					users: ctx.state.user.id,
				},
				populate: ["product_item"],
			});
			return { data: response };
		},

		async delete(ctx) {
			const user = ctx.state.user;
			const cartItem = await strapi.entityService.findOne(
				"api::cart.cart",
				ctx.params.id,
				{
					populate: {
						users: {
							fields: ["id"],
						},
					},
				},
			);
			if (!cartItem) {
				return {
					data: null,
					error: {
						status: 404,
						name: "NotFoundError",
						message: "Cart item not found",
					},
				};
			}
			if (cartItem.users.id !== user.id) {
				return {
					data: null,
					error: {
						status: 404,
						name: "NotFoundError",
						message: "Cart item not found",
					},
				};
			}
			const response = await strapi.entityService.delete(
				"api::cart.cart",
				ctx.params.id,
			);
			return { data: response };
		},

		async update(ctx) {
			const { body } = ctx.request;

			if (body.data.quantity < 1 || !body.data.quantity) {
				return {
					data: null,
					error: {
						status: 400,
						name: "FieldError",
						message: "Quantity must be greater than 0",
					},
				};
			}

			const product_item = await strapi.entityService.findOne(
				"api::product-item.product-item",
				body.data.product_item,
			);

			if (!product_item) {
				return {
					data: null,
					error: {
						status: 404,
						name: "NotFoundError",
						message: "Product item not found",
					},
				};
			}

			const quantity = await strapi.entityService.findMany(
				"api::product-merchant.product-merchant",
				{
					filters: {
						product_item: {
							id: {
								$eq: product_item.id,
							},
						},
					},
					fields: ["quantity"],
				},
			);

			if (quantity < body.data.quantity) {
				return {
					data: null,
					error: {
						status: 400,
						name: "FieldError",
						message: "Quantity is not enough",
					},
				};
			}
			const response = await strapi.entityService.update(
				"api::cart.cart",
				ctx.params.id,
				{
					data: {
						quantity: body.data.quantity,
						product_item: body.data.product_item,
					},
				},
			);
			return { data: response };
		},
	}),
);

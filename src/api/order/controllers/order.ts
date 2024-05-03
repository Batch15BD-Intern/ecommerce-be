/**
 * order controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
	"api::order.order",
	({ strapi }) => ({
		async find(ctx) {
			const result = await strapi.entityService.findMany("api::order.order", {
				filters: {
					user: ctx.state.user.id,
				},
				populate: {
					order_lines: {
						fields: ["price", "quantity"],
						populate: {
							product_item: {
								fields: ["name"],
								populate: {
									image: {
										fields: ["formats"],
									},
								},
							},
						},
					},
				},
				fields: ["total"],
			});

			return { data: result };
		},
		async orderAll(ctx) {
			const order = await super.find(ctx);
			return order;
		},

		async create(ctx) {
			const ids: any[] = [];
			let idDiscount = null;
			let total = 0;
			for (const e of ctx.request.body.data) {
				const product_item = await strapi.entityService.findOne(
					"api::product-item.product-item",
					e.product_item,
					{
						fields: ["price"],
					},
				);
				idDiscount = e.discount_code;

				const res = await strapi.entityService.create(
					"api::order-line.order-line",
					{
						data: {
							user: ctx.state.user.id,
							product_item: e.product_item,
							quantity: e.quantity,
							price: product_item.price,
						},
					},
				);
				ids.push(res.id);
				let discountedPrice = product_item.price;
				const findDiscount = await strapi.entityService.findOne(
					"api::discount-code.discount-code",
					idDiscount,
					{
						fields: ["discount_amount", "type"],
						populate: {
							products: {
								fields: ["id"],
							},
						},
					},
				);
				for (const d of findDiscount.products) {
					const findprdi = await strapi.entityService.findOne(
						"api::product.product",
						d.id,
						{
							populate: {
								product_items: {
									fields: ["id"],
								},
							},
						},
					);

					for (const p of findprdi.product_items) {
						// Check if product item is eligible for discount
						if (e.product_item === p.id) {
							if (findDiscount.type === "percentage") {
								discountedPrice =
									product_item.price * (1 - findDiscount.discount_amount);
							} else {
								discountedPrice -= findDiscount.discount_amount; // Fixed amount discount
							}
						}
					}
					total += e.quantity * discountedPrice; // Caculate total price
				}
				console.log(discountedPrice);
			}
			const userAddress = await strapi.entityService.findMany(
				"api::user-address.user-address",
				{
					filters: {
						user: ctx.state.user.id,
					},
					sort: ["createdAt:desc"],
					limit: 1,
				},
			);

			const result = await strapi.entityService.create("api::order.order", {
				data: {
					user: ctx.state.user.id,
					status: "pending",
					order_lines: ids,
					user_address: userAddress[0].id,
					total: total,
					discount_code: idDiscount,
				},
			});
			return result;
		},
		async update(ctx) {
			const { body } = ctx.request;
			const order = await strapi.entityService.findOne(
				"api::order.order",
				ctx.params.id,
				{
					fields: ["status"],
				},
			);

			if (order.status === "shipped" || order.status === "processing") {
				return ctx.badRequest({
					error: {
						status: 400,
						message:
							"Orders have been processing or shipped and cannot be canceled",
					},
				});
			}
			const response = await strapi.entityService.update(
				"api::order.order",
				ctx.params.id,
				{
					data: {
						status: body.data.status,
					},
				},
			);

			return { data: response };
		},
	}),
);

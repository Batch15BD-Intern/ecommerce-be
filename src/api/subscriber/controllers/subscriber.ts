/**
 * subscriber controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
	"api::subscriber.subscriber",
	({ strapi }) => ({
		async unsubscribe(ctx) {
			const { token } = ctx.params;

			if (!token) {
				return ctx.badRequest("Missing token");
			}

			const user = await strapi.entityService.findMany(
				"api::subscriber.subscriber",
				{
					filters: {
						token: {
							$eq: token,
						},
					},
				},
			);

			if (!user) {
				return ctx.badRequest("Invalid token");
			}

			// biome-ignore lint/complexity/noForEach: <explanation>
			user.forEach(async (user) => {
				user.activated = false;
				user.token = null;
				await strapi.entityService.update(
					"api::subscriber.subscriber",
					user.id,
					{
						data: user,
					},
				);
			});

			return user;
		},
	}),
);

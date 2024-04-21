export default {
	async afterCreate(event) {
		// Connected to "Save" button in admin panel
		const { result } = event;

		try {
			// Get user from subscription for anouncement
			const users = await strapi.entityService.findMany(
				"api::subscriber.subscriber",
				{
					filters: {
						activated: true,
					},
				},
			);

			for (const user of users) {
				await strapi
					.plugin("email-designer")
					.service("email")
					.sendTemplatedEmail(
						{
							// required
							to: user.email,
							attachments: [],
						},
						{
							// required - Ref ID defined in the template designer (won't change on import)
							templateReferenceId: 1,
						},
						{
							name_promotion: result.name,
							promotion_value: result.discount_rate,
						},
					);
			}
		} catch (err) {
			console.log(err);
		}
	},
};

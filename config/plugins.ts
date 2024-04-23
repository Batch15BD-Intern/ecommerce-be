export default ({ env }) => ({
	chartbrew: true,
	upload: {
		config: {
			provider: "cloudinary",
			providerOptions: {
				cloud_name: env("CLOUDINARY_NAME"),
				api_key: env("CLOUDINARY_KEY"),
				api_secret: env("CLOUDINARY_SECRET"),
			},
			actionOptions: {
				upload: {},
				uploadStream: {},
				delete: {},
			},
		},
	},
	email: {
		config: {
			provider: "strapi-provider-email-smtp",
			providerOptions: {
				host: "smtp-hoang3409.alwaysdata.net",
				port: 587,
				// secure: true,
				username: "hoang3409@alwaysdata.net",
				password: "k8eHarwdXQH.AJg",
				rejectUnauthorized: true,
				// requireTLS: true,
				connectionTimeout: 3,
			},
			settings: {
				from: "hoang3409@alwaysdata.net",
				replyTo: "hoang3409@alwaysdata.net",
			},
		},
	},
});

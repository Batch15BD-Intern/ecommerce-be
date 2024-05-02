export default [
	"strapi::logger",
	"strapi::errors",
	{
		name: "strapi::security",
		config: {
			contentSecurityPolicy: {
				useDefaults: true,
				directives: {
					"connect-src": ["'self'", "http:", "https:"],
					"media-src": ["'self'", "data:", "blob:", "res.cloudinary.com"],
					"frame-src": ["'self'", "editor.unlayer.com"],
					"script-src": [
						"'self'",
						"editor.unlayer.com",
						"editor.unlayer.com/embed.js",
					],
					"img-src": [
						"'self'",
						"data:",
						"blob:",
						"cdn.jsdelivr.net",
						"strapi.io",
						"s3.amazonaws.com",
						"res.cloudinary.com",
						"market-assets.strapi.io", // icons of plugins in marketplace
					],
					upgradeInsecureRequests: null,
				},
			},
		},
	},
	{
		name: "strapi::cors",
		config: {
			enabled: true,
			headers: "*",
			origin: [
				"http://localhost:1337",
				"https://ecommerce.zeabur.app/",
				"https://ecommerce-fe.zeabur.app/",
			],
		},
	},
	"strapi::poweredBy",
	"strapi::query",
	"strapi::body",
	"strapi::session",
	"strapi::favicon",
	"strapi::public",
];

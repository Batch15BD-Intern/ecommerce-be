export default {
	routes: [
		{
			method: "GET",
			path: "/inventory/product-item/:id",
			handler: "inventory.get",
			config: {
				policies: [],
				middlewares: [],
			},
		},
	],
};

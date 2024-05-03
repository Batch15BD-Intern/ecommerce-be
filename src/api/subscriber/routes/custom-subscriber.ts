export default {
	routes: [
		{
			method: "GET",
			path: "/unsubscribe/:token",
			handler: "subscriber.unsubscribe",
		},
	],
};

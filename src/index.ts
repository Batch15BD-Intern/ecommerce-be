export default {
	/**
	 * An asynchronous register function that runs before
	 * your application is initialized.
	 *
	 * This gives you an opportunity to extend code.
	 */
	register(/*{ strapi }*/) {},

	/**
	 * An asynchronous bootstrap function that runs before
	 * your application gets started.
	 *
	 * This gives you an opportunity to set up your data model,
	 * run jobs, or perform some special logic.
	 */
	bootstrap({ strapi }) {
		const io = require("socket.io")(strapi.server.httpServer, {
			cors: {
				origin: "http://localhost:3000",
				methods: ["GET", "POST"],
				allowedHeaders: [],
				credentials: true,
			},
		});

		io.on("connection", (socket) => {
			//Listening for a connection from the frontend
			socket.on("join", ({ username }) => {
				// Listening for a join connection
				if (username) {
					socket.join("group"); // Adding the user to the group
					socket.emit("welcome", {
						// Sending a welcome message to the User
						username: "bot",
						message: `${username}, Welcome to the group chat`,
					});
				} else {
					console.log("An error occurred");
				}
			});
			socket.on("sendMessage", async (data) => {
				// Listening for a sendMessage connection
				const strapiData = {
					// Generating the message data to be stored in Strapi
					data: {
						username: data.username,
						message: data.message,
					},
				};

				const axios = require("axios");
				const config = {
					method: "post",
					maxBodyLength: Number.POSITIVE_INFINITY,
					url: "https://ecommerce.zeabur.app/api/messages",
					headers: {
						"Content-Type": "application/json",
						Authorization:
							"Bearer b1bb51ab964e03be19c94f81149dea9374ef4dc434dba7e64c631b14ba8bae876ca3949587fad1d9b67df970983f3fd553c3a70f5ef393a0d5e4ab99d92db28842e5f195b73ed1d02096a52bd14eef22b86b5e9bd92ec8db13617a9cebd0450862d601f21533e29c5ad34e92a3be21d196309f6b01dfbfbacd800c8a1b15a7ad",
					},
					data: strapiData,
				};
				await axios
					.request(config) //Storing the messages in Strapi
					.then((e) => {
						socket.broadcast.to("group").emit("message", {
							//Sending the message to the group
							username: data.username,
							message: data.message,
						});
					})
					.catch((e) => console.log("error", e.message));
			});
		});
	},
};

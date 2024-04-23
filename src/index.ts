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
							"Bearer 78912c6f04f40c335179ddf4e5069771f41f3b773db9f864a63311cb3a6f1e9d9a9b8cc25b4aa4ad06663bba4054d91b347ad26cb250ad77723c7e95d18ce9b7e5b9e1f612a26eae59f1a79f0b3d2383d491573719d06cb46add2649e3fbb82f403cbf71dab67e86bf8a8113c4619a8ec42cd646d70cc748d843c9776f120329",
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

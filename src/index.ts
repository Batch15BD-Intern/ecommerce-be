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
				origin: "*",
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
							"Bearer aad7065ceda8b63c5546def824b31513d7d371b7685130b6d341bce002a16902c9ab37ff13e888ccdcfcae6af2c8cd21abc8a512989be02c69a919590096304a31d35a80266ff20ad1c64eeb011305f7984ea0d788cde41675fc756267bdaba9192548be1a3065f9569de8a6df3418c460c87027ba10bb016d991eb1e5299947",
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

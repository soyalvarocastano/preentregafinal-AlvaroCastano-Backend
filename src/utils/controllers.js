
export function controller(cb) {
	return (req, res, next) => {
		
		Promise.resolve(cb(req, res, next)).catch((error) => {
			
			if (!error || typeof error !== "object") {
				return res.status(500).send({
					name: "ServerError",
					message: "An unexpected server error occurred.",
				});
			}

			
			const { name = "Error", message = "An error occurred", stack, status } = error;

			
			if (typeof status === "number" && status >= 300 && status < 600) {
				return res.status(status).send({ name, message, stack });
			}

			
			res.status(500).send({
				name: "ServerError",
				message: message || "An unexpected server error occurred.",
				stack,
			});
		});
	};
}


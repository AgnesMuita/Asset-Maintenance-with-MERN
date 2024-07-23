import jwt from "jsonwebtoken";

export const notFound = (req, res, next) => {
	res.status(404);
	const error = new Error(`- Not Found - ${req.originalUrl}`);
	next(error);
};

export const errorHandler = (err, req, res, next) => {
	/* eslint-enable no-unused-vars */
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === "production" ? "⚒️" : err.stack,
	});
};

export const isAuthenticated = (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		res.status(401).json("Un-Authorized");
	}

	try {
		const token = authorization.split(" ")[1];
		const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.payload = payload;
	} catch (error) {
		res.status(401);

		if (error.name === "TokenExpiredError") {
			throw new Error(error.name);
		}
		throw new Error("Un-Authorized");
	}

	return next();
};

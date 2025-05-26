const admin = require("../../firebase");

async function authenticate(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({error: "Missing or invalid token"});
	}

	const idToken = authHeader.split("Bearer ")[1];

	try {
		const decodedToken = await admin.auth().verifyIdToken(idToken);
		req.user = decodedToken;
		next();
	} catch (err) {
		return res.status(401).json({error: "Unauthorized"});
	}
}

function requireRole(role) {
	return (req, res, next) => {
		const user = req.user;
		if (("role" in user) && user.role === role) {
			next();
		} else {
			res.status(403).json({error: `Access requires role: ${role}`});
		}
	};
}

module.exports = {
	authenticate,
	requireRole,
};

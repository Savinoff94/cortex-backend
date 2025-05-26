const {Router} = require("express");
const admin = require("../../../firebase");
const router = Router();

router.post("/register", async (req, res) => {
	const {email, password, role} = req.body;

	if (!email || !password || !role) {
		return res.status(400).json({
			message: "Email, password and role are required",
		});
	}

	try {
		const userRecord = await admin.auth().createUser({
			email,
			password,
		});

		// Assign the role in custom claims
		await admin.auth().setCustomUserClaims(userRecord.uid, {role});

		res.status(201).json({
			uid: userRecord.uid,
			email: userRecord.email,
			role,
			message: "User registered and role assigned successfully",
		});
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({message: error.message});
	}
});

module.exports = router;


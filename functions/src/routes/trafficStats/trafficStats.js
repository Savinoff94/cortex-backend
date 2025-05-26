const {isValidDateString} = require("../../helpers/helpers");
const {requireRole} = require("../../middleware/auth");
const {Router} = require("express");
const admin = require("../../../firebase");
const router = Router();

const db = admin.firestore();

router.get("/trafficStats", async (req, res) => {
	try {
		const {
			startDate,
			endDate,
			dateDirection = "asc",
			trafficDirection = "default",
		} = req.query;

		let query = db.collection("trafficStats");

		if (isValidDateString(startDate)) {
			query = query.where("date", ">=", new Date(startDate));
		}
		if (isValidDateString(endDate)) {
			query = query.where("date", "<=", new Date(endDate));
		}

		// if (dateDirection !== "default") {
		// 	query = query.orderBy("date", dateDirection);
		// }
		// if (trafficDirection !== "default") {
		// 	query = query.orderBy("visits", trafficDirection);
		// }

		const snapshot = await query.get();

		const results = snapshot.docs.map((doc) => ({
			id: doc.id,
			visits: doc.data().visits,
			date: doc.data().date.toDate(),
		}));

		if (trafficDirection !== "default") {
			results.sort((a, b) => {
				const val = trafficDirection === "asc" ?
					a.visits - b.visits :
					b.visits - a.visits;
				return val;
			});
		} else if (dateDirection !== "default") {
			results.sort((a, b) => {
				const val = dateDirection === "asc" ?
					a.date - b.date :
					b.date - a.date;
				return val;
			});
		}

		return res.status(200).json(results);
	} catch (error) {
		console.error("Error fetchbing data:", error);
		return res.status(500);
	}
});

router.delete("/trafficStats", requireRole("admin"), async (req, res) => {
	try {
		const {id} = req.query;

		if (!id) {
			return res.status(400).send("Missing 'id' query parameter");
		}

		await db.collection("trafficStats").doc(id).delete();
		return res.status(200).json({message: "success"});
	} catch (error) {
		console.error("Error deleting document:", error);
		return res.status(500);
	}
});

router.post("/trafficStats", requireRole("admin"), async (req, res) => {
	try {
		const {visits, date} = req.body;

		if (typeof visits !== "number" || !date) {
			return res.status(400).json({
				message: "Missing or invalid 'visits' or 'date'",
			});
		}

		const docData = {
			visits,
			date: new Date(date),
		};

		const docRef = await db.collection("trafficStats").add(docData);

		res.status(201).json({id: docRef.id, message: "Traffic stat created"});
	} catch (error) {
		console.error("Error creating traffic stat:", error);
		res.status(500).json({message: "Internal Server Error"});
	}
});

router.put("/trafficStats", requireRole("admin"), async (req, res) => {
	const {visits, date, id} = req.body;
	console.log(req.body);
	if (!id || typeof visits !== "number" || !date) {
		return res.status(400).json({message: "Missing or invalid data"});
	}

	try {
		await db.collection("trafficStats").doc(id).set({
			visits,
			date: new Date(date),
		});

		res.status(200).json({message: `Traffic stat ${id} updated`});
	} catch (err) {
		console.error("Error updating document:", err);
		res.status(500).json({message: "Internal Server Error"});
	}
});

module.exports = router;

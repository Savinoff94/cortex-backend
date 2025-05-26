require("dotenv").config();
const {defaultData} = require("./data");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const config = functions.config();

let db = null;

if (process.env.IS_DEV !== "true") {
	admin.initializeApp({
		credential: admin.credential.cert({
			"type": config.google.type,
			"project_id": config.google.project_id,
			"private_key_id": config.google.private_key_id,
			"private_key": config.google.private_key,
			"client_email": config.google.client_email,
			"client_id": config.google.client_id,
			"auth_uri": config.google.auth_uri,
			"token_uri": config.google.token_uri,
			"auth_provider_x509_cert_url": config.google.auth_provider_x509_cert_url,
			"client_x509_cert_url": config.google.client_x509_cert_url,
			"universe_domain": config.google.universe_domain,
		}),
	});
	db = admin.firestore();
}


if (process.env.IS_DEV === "true") {
	admin.initializeApp({
		projectId: "cortex-e091e",
	});

	db = admin.firestore();
	db.settings({
		host: "localhost:8080",
		ssl: false,
	});
}

async function seedData() {
	try {
		const batch = db.batch();

		for (const entity of defaultData) {
			const item = {
				visits: entity.visits,
				date: new Date(entity.date),
			};
			const docRef = db.collection("trafficStats").doc();
			batch.set(docRef, item);
		}

		await batch.commit();
		console.log("Seed successful");
		process.exit(0);
	} catch (err) {
		console.error("Error seeding data:", err);
		process.exit(1);
	}
}

seedData();

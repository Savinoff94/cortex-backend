const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const {authenticate} = require("./src/middleware/auth");
const trafficStatsRoutes = require("./src/routes/trafficStats/trafficStats");
const user = require("./src/routes/user/user");

const corsOptions = {
	origin: [
		"http://localhost:5173",
		"https://cortexfrontend.netlify.app/",
	],
	credentials: true,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use("/user", user);
app.use("/stats", authenticate, trafficStatsRoutes);

exports.api = functions.https.onRequest(app);

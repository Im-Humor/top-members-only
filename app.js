const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

//connect to database
async function main() {
	await mongoose.connect(
		`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.hszdb78.mongodb.net/?retryWrites=true&w=majority`
	);
	console.log(mongoose.connection.readyState);
}

main().catch((err) => console.log(err));

//import routers
const index = require("./routes/index");

app.use("/", index);

//start server
app.listen(3000);

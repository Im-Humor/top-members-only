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

//import models
const User = require("./models/user");
const Post = require("./models/post");

async function addUsers() {
	try {
		console.log("adding user");
		await User.insertMany([
			{
				first_name: "Daniel",
				last_name: "Morris",
				email: "orangite@gmail.com",
				password: "poop",
				membership: true,
			},
		]);
		console.log("User added");
	} catch (error) {
		console.log(error);
	}
}

addUsers();

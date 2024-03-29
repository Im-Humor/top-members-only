const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	email: String,
	password: String,
	membership: Boolean,
	admin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

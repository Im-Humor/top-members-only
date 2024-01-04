const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
	title: { type: String, min: 1, max: 100 },
	date: { type: Date, default: Date.now },
	content: String,
	author: { type: mongoose.Types.ObjectId, ref: "User" },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

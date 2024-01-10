const express = require("express");
const router = express.Router();
const valid = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Post = require("../models/post");
const passport = require("passport");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// express validation for signup form
const createUserValidator = [
	valid.body("first_name").notEmpty().isAlpha(),
	valid.body("last_name").notEmpty().isAlpha(),
	valid
		.body("email")
		.notEmpty()
		.isEmail()
		.custom(async (value) => {
			const findEmail = await User.findOne({ email: value });
			if (findEmail) {
				throw new Error("Email already in use");
			}
		}),
	valid.body("password").notEmpty().isAlphanumeric(),
	valid.body("confirm_password").custom((value, { req }) => {
		return value === req.body.password;
	}),
];

//post method for receiving signup form information
router.post("/", createUserValidator, (req, res) => {
	const result = valid.validationResult(req);
	if (result.isEmpty()) {
		bcrypt.hash(req.body.password, 8, async (err, hash) => {
			if (err) {
				console.log(err);
			} else {
				await User.create({
					first_name: req.body.first_name,
					last_name: req.body.last_name,
					email: req.body.email,
					password: hash,
					membership: false,
				});
				res.redirect("/");
			}
		});
	} else {
		res.redirect("/");
	}
});

router.get("/", async (req, res) => {
	const posts = await Post.find({}).sort({ date: -1 });
	for (let post of posts) {
		const author = await User.findById(post.author);
		post.author = author;
	}
	res.render("index", { title: "Homepage", posts: posts });
});

router.get("/login", (req, res) => {
	res.render("login", { title: "Log in" });
});

router.post(
	"/login",
	passport.authenticate("local", {
		failureRedirect: "/login",
		failureMessage: true,
	}),
	(req, res) => {
		res.redirect("/");
	}
);

router.get("/join-club", (req, res) => {
	res.render("join-club", { title: "Upgrade Membership" });
});

router.post("/join-club", async (req, res) => {
	if (req.body.join_code == "69420") {
		try {
			const user = await User.findOne({ email: req.user.email });
			user.membership = true;
			await user.save();
		} catch (err) {
			console.log(err);
		}
		res.redirect("/");
	} else {
		res.redirect("/join-club");
	}
});

router.get("/account", (req, res) => {
	res.render("account", { title: "Account" });
});

router.get("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

router.get("/new-post", (req, res) => {
	res.render("new-post", { title: "Create Post" });
});

router.post("/new-post", async (req, res) => {
	const user = await User.findOne({ email: req.user.email });
	if (user) {
		try {
			await Post.create({
				title: req.body.title,
				content: req.body.content,
				author: user._id,
			});
			res.redirect("/");
		} catch (err) {
			console.log(err);
			res.redirect("/new-post");
		}
	}
});

router.get("/post/:postID/delete", async (req, res) => {
	if (req.user) {
		try {
			await Post.deleteOne({ _id: req.params.postID });
			res.redirect("/");
		} catch (err) {
			console.log(err);
			res.redirect("/");
		}
	} else {
		console.log("Please log in");
		res.redirect("/");
	}
});

router.post("/upgrade-admin", async (req, res) => {
	if (req.user && req.body.adminCode == "1337") {
		try {
			await User.updateOne({ _id: req.user._id }, { admin: true });
			res.redirect("/");
		} catch (err) {
			console.log(err);
			res.redirect("/");
		}
	}
});

module.exports = router;

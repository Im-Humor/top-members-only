const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const session = require("express-session");

//set view engine
app.set("views", "./views");
app.set("view engine", "ejs");

//set public directory
app.use(express.static("public"));

//set passport strategy
passport.use(
	new LocalStrategy(async function verify(username, password, done) {
		try {
			const user = await User.findOne({ email: username });
			if (!user) {
				return done(null, false, { message: "Incorrect username" });
			}
			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				return done(null, false, { message: "Incorrect password" });
			}
			return done(null, user);
		} catch (err) {
			console.log(err);
		}
	})
);

app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
	})
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});

app.use(passport.initialize());
app.use(passport.session());

//connect to database
async function main() {
	await mongoose.connect(
		`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.hszdb78.mongodb.net/?retryWrites=true&w=majority`
	);
}

main().catch((err) => console.log(err));

// make user available to all views via locals object
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

//import routers
const index = require("./routes/index");

app.use("/", index);

//start server
app.listen(3000);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const path = require("path");

// code to make authentication work
const User = require("./models/user");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const { isLoggedIn } = require("./middleware");

const dbUrl = process.env.ATLAS_URL;

async () => {
    await mongoose.connect(dbUrl);
};

// set up ejsMate
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: process.env.SECRET,
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SECRET,
    },
});


store.on("error", function (e) {
    console.log("Session Store Error", e);
});

const sessionConfig = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));
app.use(flash());

// set up passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});


// set up routes
app.use("/", userRoutes);
app.use("/tasks", isLoggedIn, taskRoutes);

// set up home route
app.get("/", (req, res) => {
    res.send("Hi I am root route");
});

// set up 404 route
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

// set up error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;   
    res.status(statusCode).render("error", { message });
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});

// Development: Node.js, Express.js, MongoDB, Mongoose, Passport.js, EJS, HTML, CSS, JavaScript
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

// connect to MongoDB
mongoose.connect("mongodb://localhost:27017/oisbsip_taskno", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// check if the connection is successful
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// set up ejsMate
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// set up express
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// set up session
const secret = process.env.SECRET ||
    "thisshouldbeabettersecret!";
const store = MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/oisbsip_taskno",
    secret,
    touchAfter: 24 * 3600,
    });
store.on("error", function (e) {
    console.log("Session Store Error", e);
});

const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));

// set up passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set up flash
const flash = require("connect-flash");
app.use(flash());

// set up middleware to pass user to all
// templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// set up routes
app.use("/", userRoutes);
app.use("/tasks", isLoggedIn, taskRoutes);

// set up home route
app.get("/", (req, res) => {
    res.render("home");
});

// set up 404 route
app.all("*", (req, res, next) => {
    res.status(404).send("Page not found");
});

// set up error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// set up port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});

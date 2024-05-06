const ExpressError = require("./utils/ExpressError");
const { TaskSchema } = require("./schema.js");

module.exports.validateTasks = (req, res, next) => {
  let { error } = TaskSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/login"); // Redirect to your login route
  }
  next();
};

module.exports.saveRedirectURL = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL;
  }
  next();
};

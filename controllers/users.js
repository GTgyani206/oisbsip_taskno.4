const User = require('../models/user');
const Listing = require("../models/listing.js");
module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Welcome to Urban Trendz!');
      res.redirect('/listings');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup');
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect(res.locals.redirectURL || "/listings");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};
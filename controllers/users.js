//Rendering SignUp Form

const User = require("../models/user");
module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username, password });
    const registeredUser = await User.register(user, password);    

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome! You're now logged in");
      res.redirect("/tasks");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};


//Rendering Login Form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect(res.locals.redirectURL || "/tasks");
};


//Logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "Logged out successfully!");
    res.redirect("/tasks");
  });
};

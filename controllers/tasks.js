const User = require("../models/user.js");

module.exports.renderTasks = async (req, res) => {
  const allUsers = await User.find({});
  res.render("tasks/index.ejs", { allUsers });
};

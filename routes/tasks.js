const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const TaskController = require("../controllers/tasks");

router.get("/", wrapAsync(TaskController.index)); // Index route

module.exports = router;

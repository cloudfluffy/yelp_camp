const path = require("node:path");

const express = require("express");
const passport = require("passport");

const users = require(path.join(__dirname, "../controllers/users"))

const catchAsync = require(path.join(__dirname, "../utils/catchAsync"));
const { storeReturnTo } = require(path.join(__dirname, "../middleware"))

const router = express.Router();

router.route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route("/login")
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), catchAsync(users.login));

router.get("/logout", users.logout);

module.exports = router;
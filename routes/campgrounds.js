const path = require("node:path");

const express = require("express");
const multer = require("multer");

const campgrounds = require(path.join(__dirname, "../controllers/campgrounds"));

const catchAsync = require(path.join(__dirname, "../utils/catchAsync"));
const { isLoggedIn, validateCampground, isAuthor } = require(path.join(__dirname, "../middleware"));

const { storage } = require(path.join(__dirname, "../cloudinary"));

const upload = multer({ storage });

const router = express.Router();

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
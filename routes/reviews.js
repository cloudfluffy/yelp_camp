const path = require("node:path");

const express = require("express");

const reviews = require(path.join(__dirname, "../controllers/reviews"));

const catchAsync = require(path.join(__dirname, "../utils/catchAsync"));
const { validateReview, isLoggedIn, isReviewAuthor } = require(path.join(__dirname, "../middleware"));

const router = express.Router({ mergeParams: true });

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
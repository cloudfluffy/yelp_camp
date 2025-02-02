const path = require("node:path");

const Campground = require(path.join(__dirname, "../models/campground"));
const Review = require(path.join(__dirname, "../models/review"))

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);

    await review.save();
    await campground.save();

    req.flash("success", "Created new reviews");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: { _id: reviewId } } });
    const review = await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${id}`);
};
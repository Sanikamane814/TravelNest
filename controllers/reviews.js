const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// Create a new review
module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id; // Set review author
    await review.save();
    listing.reviews.push(review); // Add review to listing
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
};

// Delete a review
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove from listing
    await Review.findByIdAndDelete(reviewId); // Delete review
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};

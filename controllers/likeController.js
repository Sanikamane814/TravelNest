const Like = require('../models/Like'); // Like model (if used)
const User = require('../models/User'); // User model

// Toggle like for a listing
exports.toggleLike = async (req, res) => {
  const { listingId } = req.params; // Get listing ID from URL
  const userId = req.user._id; // Get logged-in user ID

  try {
    // ✅ Option 1: Likes stored in Listing model
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user already liked
    const isLiked = listing.likes.includes(userId);

    if (isLiked) {
      listing.likes.pull(userId); // Remove like
    } else {
      listing.likes.push(userId); // Add like
    }

    await listing.save(); // Save changes
    return res.status(200).json({ likes: listing.likes.length });

    // ✅ Option 2: Likes stored in Like model (optional use)
    const existingLike = await Like.findOne({ user: userId, listing: listingId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id }); // Remove like record
    } else {
      const newLike = new Like({ user: userId, listing: listingId });
      await newLike.save(); // Add like record
    }

    const newLikeCount = await Like.countDocuments({ listing: listingId }); // Count total likes
    return res.status(200).json({ likes: newLikeCount });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' }); // Handle error
  }
};

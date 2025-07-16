// models/Like.js
const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The user who liked the listing
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }, // The listing being liked
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;

// routes/likeRoutes.js
const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { isAuthenticated } = require('../middleware/auth'); // Assuming you have authentication middleware

// Route to toggle like on a listing
router.post('/like/:listingId', isAuthenticated, likeController.toggleLike);

module.exports = router;

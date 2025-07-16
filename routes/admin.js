const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Review = require("../models/review");

// Load credentials from environment variables
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

// Show admin login page
router.get("/login", (req, res) => {
  res.render("admin/adminLogin");
});

// Handle admin login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === adminUsername && password === adminPassword) {
    req.session.isAdmin = true;
    req.flash("success", "Welcome Admin!");
    return res.redirect("/admin/dashboard");
  } else {
    req.flash("error", "Invalid admin credentials.");
    return res.redirect("/admin/login");
  }
});

// Admin logout
router.get("/logout", (req, res) => {
  req.session.isAdmin = false;
  req.flash("success", "Logged out from admin panel.");
  res.redirect("/admin/login");
});

// Middleware to check if admin is logged in
function isAdminLoggedIn(req, res, next) {
  if (req.session.isAdmin) return next();
  req.flash("error", "Admin login required.");
  res.redirect("/admin/login");
}

// Show dashboard
router.get("/dashboard", isAdminLoggedIn, async (req, res) => {
  const users = await User.find({});
  const listings = await Listing.find({}).populate("owner");
  const bookings = await Booking.find({}).populate("user").populate("listing");
  const reviews = await Review.find({}).populate("author");

  res.render("admin/dashboard", { users, listings, bookings, reviews });
});

module.exports = router;

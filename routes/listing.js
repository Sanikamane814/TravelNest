const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listings");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Contact = require("../models/contact");
const { data: sampleListings } = require("../init/data");

// ===================
// 🆘 Help Center (User-Specific Listings Search)
// ===================
router.get("/help-center", isLoggedIn, async (req, res) => {
  const { q } = req.query;
  const searchQuery = q || "";
  let searchResults = [];

  if (searchQuery.trim()) {
    const regex = new RegExp(searchQuery.trim(), "i");
    searchResults = await Listing.find({
      owner: req.user._id,
      $or: [{ title: regex }, { location: regex }, { country: regex }]
    });
  }

  res.render("listings/help", { searchResults, searchQuery });
});

// ===================
// 🔍 General Search (MongoDB + Static)
// ===================
router.get("/search", async (req, res) => {
  const { destination, checkin, checkout, guests } = req.query;
  const regex = new RegExp(destination, "i");

  const mongoResults = await Listing.find({
    $or: [{ location: regex }, { country: regex }, { title: regex }]
  });

  const staticResults = sampleListings.filter(listing =>
    listing.location.toLowerCase().includes(destination.toLowerCase()) ||
    listing.country.toLowerCase().includes(destination.toLowerCase()) ||
    listing.title.toLowerCase().includes(destination.toLowerCase())
  );

  const allResults = [...mongoResults, ...staticResults];

  res.render("listings/search", {
    allResults,
    query: destination,
    checkin,
    checkout,
    guests
  });
});

// ===================
// 📋 All Listings Routes
// ===================
router.route("/")
  .get(wrapAsync(listingController.index)) // Show all listings
  .post(
    isLoggedIn,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingController.createListing) // Create new listing
  );

// ➕ New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ===================
// 📄 Show, Edit, Delete Individual Listing
// ===================
router.route("/:id")
  .get(wrapAsync(listingController.showListing)) // Show listing details
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingController.updateListing) // Update listing
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); // Delete listing

// ✏️ Edit Listing Form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// ============================
// 💳 Payment Page (After Book Now)
// ============================
router.post("/:id/payment", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, guests, phone, email } = req.body;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
  if (nights <= 0 || guests <= 0) {
    req.flash("error", "Invalid check-in/check-out or guest count.");
    return res.redirect(`/listings/${id}`);
  }

  const totalAmount = listing.price * guests * nights;

  req.session.booking = {
    checkIn,
    checkOut,
    guests,
    phone,
    email,
    perGuestPrice: listing.price,
    totalAmount,
    paymentTime: new Date()
  };

  res.render("listings/payment", { listing, booking: req.session.booking });
});

// ✅ Booking Confirmation (after payment)
router.post("/:id/book/confirm", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const bookingDetails = req.session.booking;
  if (!bookingDetails) {
    req.flash("error", "Session expired. Please try again.");
    return res.redirect(`/listings/${id}`);
  }

  const listing = await Listing.findById(id);
  const newBooking = new Booking({
    listing: id,
    user: req.user._id,
    checkIn: bookingDetails.checkIn,
    checkOut: bookingDetails.checkOut,
    guests: bookingDetails.guests,
    phone: bookingDetails.phone,
    email: bookingDetails.email,
    status: "confirmed"
  });

  await newBooking.save();

  req.session.bookingConfirmed = {
    _id: newBooking._id,
    title: listing.title,
    checkIn: bookingDetails.checkIn,
    checkOut: bookingDetails.checkOut,
    guests: bookingDetails.guests,
    phone: bookingDetails.phone,
    email: bookingDetails.email,
    perGuestPrice: bookingDetails.perGuestPrice,
    totalAmount: bookingDetails.totalAmount,
    paymentTime: bookingDetails.paymentTime
  };

  delete req.session.booking;
  res.redirect(`/listings/${id}/success`);
});

// 🎉 Booking Success Page
router.get("/:id/success", isLoggedIn, (req, res) => {
  const booking = req.session.bookingConfirmed;
  if (!booking) {
    req.flash("error", "No booking found.");
    return res.redirect("/listings");
  }
  res.render("listings/success", { booking });
});

// ===================
// ❌ Cancel Booking (Confirmation Page)
// ===================
router.get("/booking/:id/cancel", isLoggedIn, async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("listing");
  if (!booking) {
    req.flash("error", "Booking not found.");
    return res.redirect("/listings");
  }
  res.render("listings/cancelBooking", { booking });
});

// ✅ Confirm Cancel Booking
router.post("/booking/:id/cancel/confirm", isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const booking = await Booking.findById(id);
  if (!booking) {
    req.flash("error", "Booking not found.");
    return res.redirect("/listings");
  }

  booking.status = "cancelled";
  booking.cancellationReason = reason || "";
  booking.cancelledAt = new Date();

  await booking.save();

  req.flash("success", "Your booking has been cancelled.");
  res.redirect(`/users/${req.user._id}/profile`);
}));

// ===================
// 📩 Contact Form Submission
// ===================
router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    res.json({ success: true, message: "Thanks for reaching out!" });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});



module.exports = router;

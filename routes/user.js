
const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");

const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Contact = require("../models/contact");
const User = require("../models/user");

// =====================
// 🔐 Auth Routes
// =====================
router.route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signupUser));

router.route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginUser
  );

router.get("/logout", userController.logoutUser);

// =====================
// 📄 Static Pages
// =====================
router.get("/privacy", (req, res) => res.render("listings/privacy"));
router.get("/terms", (req, res) => res.render("listings/terms"));
router.get("/sitemap", (req, res) => res.render("listings/sitemap"));
router.get("/contact", (req, res) => res.render("listings/contact"));
router.get("/company", (req, res) => res.render("listings/company"));
router.get("/help", (req, res) => res.render("listings/help"));

// =====================
// 👤 View Profile Page
// =====================
router.get("/users/:id/profile", isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  // ✅ Show all bookings: confirmed and cancelled
  const bookings = await Booking.find({ user: id }).populate("listing");

  const listings = await Listing.find({ owner: id });
  const contacts = await Contact.find({ user: id });

  res.render("listings/profile", {
    user,
    listings,
    bookings,
    contacts,
  });
}));

// ✅ Redirect "/profile" to current user's profile
router.get("/profile", isLoggedIn, (req, res) => {
  res.redirect(`/users/${req.user._id}/profile`);
});

// =====================
// ✏️ Edit Profile Form
// =====================
router.get("/users/:id/Profileedit", isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/listings");
  }
  res.render("listings/Profileedit", { user });
}));

// =====================
// 🔄 Update Profile
// =====================
router.put("/users/:id", isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  await User.findByIdAndUpdate(id, { username, email }, {
    new: true,
    runValidators: true,
  });

  req.flash("success", "Profile updated successfully!");
  res.redirect(`/users/${id}/profile`);
}));


router.get("/forgot-password", (req, res) => {
  res.render("users/forgotPassword");
});


module.exports = router;

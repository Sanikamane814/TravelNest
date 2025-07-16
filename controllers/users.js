const User = require("../models/user");

// Show signup form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup"); // views/users/signup.ejs
};

// Handle user signup
module.exports.signupUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome to TravelNest, ${registeredUser.username}! Your journey begins here.`);
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// Show login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login"); // views/users/login.ejs
};

// Handle login
module.exports.loginUser = async (req, res, next) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      req.flash("error", "Please sign up first before logging in.");
      return res.redirect("/signup");
    }
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  } catch (error) {
    next(error);
  }
};

// Handle logout
module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have logged out");
    res.redirect("/login");
  });
};

// Show edit profile form
module.exports.renderEditProfile = (req, res) => {
  res.render("listings/editProfile", { user: req.user });
};

// Update profile
module.exports.updateProfile = async (req, res) => {
  const { username, email } = req.body;
  await User.findByIdAndUpdate(req.user._id, { username, email });
  req.flash("success", "Profile updated successfully");
  res.redirect("/profile");
};

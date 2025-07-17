

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const bookingRoutes = require('./routes/booking');
// ✅ Import Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");





// ✅ MongoDB Connection
const dbUrl = process.env.ATLASOB_URL || "mongodb://127.0.0.1:27017/wanderlust";
mongoose.connect(dbUrl)
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ View Engine Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const userRoutes = require('./routes/user');

app.use("/user", userRoutes);


// ✅ Session Store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || "thisshouldbeabettersecret",
  },
  touchAfter: 24 * 3600, // reduce session update frequency
});

store.on("error", (err) => {
  console.log("❌ SESSION STORE ERROR:", err);
});

// ✅ Session Configuration
const sessionOptions = {
  store,
  secret: process.env.SECRET || "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());






// ✅ Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Set locals for all templates
app.use((req, res, next) => {
  res.locals.currUser = req.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


// app.use("/listings", listingsRoutes);
app.use(express.json()); // Needed for parsing JSON POST

app.use(express.urlencoded({ extended: true }));

app.use('/booking', bookingRoutes);
app.use(methodOverride('_method'));


const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);


// ✅ Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ✅ 404 Handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error", { message });
});

// ✅ Start Server
app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});










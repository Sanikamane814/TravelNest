const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const ObjectId = mongoose.Types.ObjectId;
const MONGO_URL = "mongodb://127.0.0.1:27017/DreamStayz";

// Connect to MongoDB
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Seed the database
const initDB = async () => {
  await Listing.deleteMany({}); // Delete all listings

  // Add owner ID to each listing
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: new ObjectId("685bd0f775079323e1c065e3"), // Set valid user ID as owner
  }));

  await Listing.insertMany(initData.data); // Insert new listings
  console.log("data was initialized");
};

initDB(); // Run the seed function

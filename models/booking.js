const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  listing: { type: Schema.Types.ObjectId, ref: "Listing" },
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  phone: String,
  email: String,
  status: {
    type: String,
    enum: ["confirmed", "cancelled"],
    default: "confirmed"
  }
});

module.exports = mongoose.model("Booking", bookingSchema);

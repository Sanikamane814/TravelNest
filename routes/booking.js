const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const { isLoggedIn } = require('../middleware');

// GET Cancel Terms Page
router.get('/:id/cancel', isLoggedIn, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.redirect('/listings');
  res.render('listings/cancelBooking', { booking });
});

// POST Cancel Confirmation
router.post('/:id/cancel/confirm', isLoggedIn, async (req, res) => {
  const { agree } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.redirect('/listings');

  if (!agree) {
    req.flash('error', 'You must agree to the terms before cancelling.');
    return res.redirect(`/booking/${req.params.id}/cancel`);
  }

  await Booking.findByIdAndDelete(req.params.id);
  req.flash('success', 'Your booking has been canceled.');
  res.redirect('/listings');
});

module.exports = router;

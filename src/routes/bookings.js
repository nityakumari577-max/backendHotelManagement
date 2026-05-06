const express = require('express');
const router  = express.Router();
const {
  createBooking,
  getBookingById,
  getBookingsByEmail,
  cancelBooking,
  getAllBookings,
  deleteBooking,
} = require('../controllers/bookingController');

const { protect, adminOnly } = require('../middleware/auth');

// ── Public Routes (no login needed) ──────────────────────
router.post('/',                    createBooking);       // Make a booking
router.get('/:id',                  getBookingById);      // View a booking
router.get('/guest/:email',         getBookingsByEmail);  // View by email
router.put('/:id/cancel',           cancelBooking);       // Cancel a booking

// ── Admin Routes (JWT protected) ─────────────────────────
router.get('/',          protect, adminOnly, getAllBookings);   // All bookings
router.delete('/:id',   protect, adminOnly, deleteBooking);    // Delete booking

module.exports = router;
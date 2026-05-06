const Booking = require('../models/Booking');
const Room = require('../models/Room');

// ─────────────────────────────────────────────
// Create a booking
// ─────────────────────────────────────────────
exports.createBooking = async (req, res) => {
  const { roomId, guestName, guestEmail, checkIn, checkOut } = req.body;

  try {
    const room = await Room.findById(roomId);

    if (!room || !room.isAvailable) {
      return res.status(400).json({ error: 'Room not available' });
    }

    const booking = await Booking.create({
      room: roomId,
      guestName,
      guestEmail,
      checkIn,
      checkOut,
      status: 'booked',
    });

    room.isAvailable = false;
    await room.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// Get all bookings (Admin)
// ─────────────────────────────────────────────
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('room');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// Get booking by ID
// ─────────────────────────────────────────────
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// Get bookings by email
// ─────────────────────────────────────────────
exports.getBookingsByEmail = async (req, res) => {
  try {
    const bookings = await Booking.find({
      guestEmail: req.params.email,
    }).populate('room');

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// Cancel booking
// ─────────────────────────────────────────────
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    await Room.findByIdAndUpdate(booking.room, { isAvailable: true });

    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// Delete booking (Admin)
// ─────────────────────────────────────────────
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await Room.findByIdAndUpdate(booking.room, { isAvailable: true });

    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
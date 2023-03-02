const express = require("express");
const router = express.Router();

const {
  createBooking,
  getAllBookings,
  updateBooking,
  deleteBooking,
} = require("../controllers/Booking");


router.get("/bookings", getAllBookings);
router.post("/bookings", createBooking);
router.post("/bookings/:id", updateBooking);
router.delete("/bookings/:id", deleteBooking);


module.exports = router;
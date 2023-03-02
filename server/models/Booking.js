
const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    email: String,
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    startTime: String,
    endTime: String,
    price: Number,
    roomName: String,
  });
  module.exports  =  mongoose.model('Booking', bookingSchema);
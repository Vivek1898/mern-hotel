
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['A', 'B', 'C'],
      required: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  });

  module.exports  = mongoose.model('Room', roomSchema);


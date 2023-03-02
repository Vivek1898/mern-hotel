const Booking = require('../models/Booking');
const Room = require('../models/Room');

 // Create a new room
 exports.createRoom = async (req, res) =>  {
    const room = new Room({
      name: req.body.name,
      type: req.body.type,
      pricePerHour: req.body.pricePerHour,
    });
  
    try {
      const newRoom = await room.save();
      res.status(201).json(newRoom);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


  exports.getAllRoom = async (req, res) =>  {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};


// Delete a room by ID
exports.deleteRoom = async (req, res) =>  {
    try {
      const { id } = req.params;
      const room = await Room.findByIdAndDelete(id);
      if (!room) {
        return res.status(404).send();
      }
      res.send(room);
    } catch (error) {
      res.status(500).send(error);
    }
  };

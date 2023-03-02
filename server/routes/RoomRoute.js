const express = require("express");
const router = express.Router();

const {
  createRoom,
  getAllRoom,
  deleteRoom,
} = require("../controllers/Room");


router.get("/rooms", getAllRoom);
router.post("/rooms/add", createRoom);
router.delete("/rooms/:id", deleteRoom);


module.exports = router;
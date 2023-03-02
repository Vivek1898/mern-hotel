import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import FormUse from "../Components/Form/FormUser";

const App = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingPrice, setBookingPrice] = useState("");
  const [loading, setLoading] = useState(false);
  // const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    roomId: "",
    startTime: "",
    endTime: "",
    price: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_GLOBAL_API_URL}/api/rooms`
      );
      setRooms(res.data);
    };

    const fetchBookings = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_GLOBAL_API_URL}/api/bookings`
      );
      setBookings(res.data);
    };

    fetchRooms();
    fetchBookings();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const [currentRoomType, setCurrentRoomType] = useState("");
  const handleRoomSelect = (event) => {
    setBookingPrice("");
    setCurrentRoomType("");
    const roomId = event.target.value;
    const room = rooms.find((room) => room._id === roomId);
    console.log(room);
    setCurrentRoomType(room.type);

    setFormData({
      ...formData,
      roomId,
    });
    setBookingPrice(
      calculateBookingPrice(room, formData.startTime, formData.endTime)
    );
  };

  const handleDateChange = (event, fieldName) => {
    setBookingPrice("");
    const value = event.target.value;
    console.log(value);
    setFormData({
      ...formData,
      [fieldName]: value,
    });
    if (formData.roomId) {
      const room = rooms.find((room) => room._id === formData.roomId);
      setBookingPrice(
        calculateBookingPrice(room, formData.startTime, formData.endTime)
      );
    }
  };

  function getDurationInHours(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const durationInMs = end - start;
    const durationInHours = durationInMs / (1000 * 60 * 60);
    return durationInHours;
  }
  const calculateBookingPrice = (room, startTime, endTime) => {
    const durationInHours = getDurationInHours(startTime, endTime);
    return room.pricePerHour * durationInHours;
  };

  const checkOverlap = () => {
    const startTime = new Date(formData.startTime).getTime();
    const endTime = new Date(formData.endTime).getTime();
    const overlappingBooking = bookings.find((booking) => {
      const bookingStartTime = new Date(booking.startTime).getTime();
      const bookingEndTime = new Date(booking.endTime).getTime();
      console.log(bookingStartTime);
      console.log(bookingEndTime);
      console.log(formData.roomId);
      console.log(booking.roomId._id);

      return (
        booking.roomId._id === formData.roomId &&
        ((startTime >= bookingStartTime && startTime < bookingEndTime) ||
          (endTime > bookingStartTime && endTime <= bookingEndTime) ||
          (bookingStartTime >= startTime && bookingEndTime <= endTime))
      );
    });
    return overlappingBooking;
  };

  // const totalTypeRoomsBooked = bookings.reduce((total, booking) => {

  //   if (booking.roomId.type === currentRoomType) {
  //     return total + 1;
  //   } else {
  //     return total;
  //   }
  // }, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(formData.roomId.type);
    //
    setLoading(true);
    console.log(currentRoomType);

    // Get the total number of rooms of the same type as the current room being booked
    const totalTypeRoomsBooked = bookings.reduce((total, booking) => {
      if (booking.roomId.type === currentRoomType) {
        // Check if the maximum number of rooms of this type has been reached
        if (currentRoomType === "A" && total >= 2) {
          return total;
        } else if (currentRoomType === "B" && total >= 3) {
          return total;
        } else if (currentRoomType === "C" && total >= 5) {
          return total;
        } else {
          return total + 1;
        }
      } else {
        return total;
      }
    }, 0);
    console.log(currentRoomType);
    // Check if the maximum number of rooms of this type has been reached
    if (currentRoomType === "A" && totalTypeRoomsBooked >= 2) {
      Swal.fire(
        "Opps",
        "All rooms of type A are booked. Please select another room type.",
        "error"
      );
      setLoading(false);
      return;
    } else if (currentRoomType === "B" && totalTypeRoomsBooked >= 3) {
      Swal.fire(
        "Opps",
        "All rooms of type B are booked. Please select another room type.",
        "error"
      );
      setLoading(false);
      return;
    } else if (currentRoomType === "C" && totalTypeRoomsBooked >= 5) {
      Swal.fire(
        "Opps",
        "All rooms of type C are booked. Please select another room type.",
        "error"
      );
      setLoading(false);
      return;
    }

    try {
      // if(currentRoomType === "A" && totalTypeRoomsBooked > 2){
      setLoading(true);
      const overlappingBooking = checkOverlap();
      //console.log(overlappingBooking);

      if (overlappingBooking) {
        Swal.fire(
          "Opps",
          "This room is already booked for the selected time range",
          "error"
        );
        setLoading(false);
        // alert('This room is already booked for the selected time range');
        return;
      }

      // return;
      const body = {
        formData,
        bookingPrice,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_GLOBAL_API_URL}/api/bookings`,
        body
      );
      console.log(res);
      setBookings([...bookings, res.data]);
      setFormData({
        email: "",
        roomId: "",
        startTime: "",
        endTime: "",
        price: "",
      });
      setBookingPrice("");
      Swal.fire(
        "Congratulations",
        "Room Booked Successfully And Details Sent To Email",
        "success"
      );
      setLoading(false);
    } catch (error) {
      Swal.fire("Opps", "Something went wrong , Try Again", "error");
      setLoading(false);
      console.log(error);
    }
  };
  // const[CurrentBookingPrice,setCurrentBookingPrice] = useState('')

  return (
    <div>
      <h2 className="text-center text-primary">Book Rooms</h2>
      <FormUse
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleDateChange={handleDateChange}
        handleRoomSelect={handleRoomSelect}
        bookingPrice={bookingPrice}
        rooms={rooms}
        loading={loading}
      />
    </div>
  );
};

export default App;

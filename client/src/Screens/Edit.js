import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "antd";
import Swal from "sweetalert2";
import FormUse from "../Components/Form/FormUser";
import { Space, Spin } from "antd";
const Edit = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingPrice, setBookingPrice] = useState("");
  const [currentBookingId, setCurrentBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    roomId: "",
    startTime: "",
    endTime: "",
    price: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      setLoadData(true);
      const res = await axios.get(
        `${process.env.REACT_APP_GLOBAL_API_URL}/api/rooms`
      );

      setRooms(res.data);
      setLoadData(false);
    };

    const fetchBookings = async () => {
      setLoadData(true);
      const res = await axios.get(
        `${process.env.REACT_APP_GLOBAL_API_URL}/api/bookings`
      );
      setBookings(res.data);
      setLoadData(false);
    };

    fetchRooms();
    fetchBookings();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoomSelect = (event) => {
    setBookingPrice("");
    const roomId = event.target.value;
    const room = rooms.find((room) => room._id === roomId);
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

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      // const overlappingBooking = checkOverlap();
      // console.log(overlappingBooking);

      // if (overlappingBooking) {
      //   Swal.fire(
      //     "Opps",
      //     "This room is already booked for the selected time range",
      //     "error"
      //   );
      //   return;
      // }
      console.log(formData.startTime);
      console.log(formData.endTime);
      // return;
      const body = {
        formData,
        bookingPrice,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_GLOBAL_API_URL}/api/bookings/${currentBookingId}`,
        body
      );
      console.log(res.data);
      setBookings((prevBookings) => {
        const updatedBookings = prevBookings.filter(
          (b) => b._id !== currentBookingId
        );
        return [...updatedBookings, res.data.booking];
      });

      setFormData({
        email: "",
        roomId: "",
        startTime: "",
        endTime: "",
        price: "",
      });
      setCurrentBookingId("");
      setBookingPrice("");
      setIsModalOpen(false);
      setLoading(false);
      Swal.fire(
        "Congratulations",
        "Room Booked Successfully And Details Sent To Email",
        "success"
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
      setIsModalOpen(false);
      Swal.fire("Opps", "Something went wrong , Try Again", "error");
    }
  };

  const handleEdit = async (booking) => {
    console.log(booking._id);
    setCurrentBookingId(booking._id);

    setIsModalOpen(true);
    setBookingPrice("");

    console.log(booking.startTime);
    console.log("Updated");
    console.log(new Date(booking.startTime).toISOString().slice(0, -1));

    setFormData({
      email: booking.email,
      roomId: booking.roomId._id,

      startTime: booking.startTime,
      endTime: booking.endTime,
      price: booking.price,
    });
    if (formData.roomId) {
      const room = rooms.find((room) => room._id === formData.roomId);
      setBookingPrice(
        calculateBookingPrice(room, formData.startTime, formData.endTime)
      );
    }
  };
  const cancelBooking = async (bookingId) => {
    console.log(bookingId);
    return axios
      .delete(
        `${process.env.REACT_APP_GLOBAL_API_URL}/api/bookings/${bookingId}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  };
  const handleDelete = async (booking) => {
    const bookingStartTime = new Date(booking.startTime).getTime();
    const currentTime = Date.now();

    if (bookingStartTime - currentTime > 48 * 60 * 60 * 1000) {
      // if booking start time is more than 48 hours, show complete refund
      await cancelBooking(booking._id);
      setBookings((bookings) => bookings.filter((b) => b._id !== booking._id));
      Swal.fire(
        "Congratulations",
        "Booking cancelled. Complete refund will be provided.",
        "success"
      );
      //  alert("Booking cancelled. Complete refund will be provided.");
    } else if (
      bookingStartTime - currentTime > 24 * 60 * 60 * 1000 &&
      bookingStartTime - currentTime <= 48 * 60 * 60 * 1000
    ) {
      // if booking start time is within 24-48 hours, show 50% refund
      await cancelBooking(booking._id);
      setBookings((bookings) => bookings.filter((b) => b._id !== booking._id));
      const refundAmount = booking.price / 2;
      Swal.fire(
        "Congratulations",
        `Booking cancelled. ${refundAmount} will be refunded.`,
        "success"
      );
      // alert(`Booking cancelled. ${refundAmount} will be refunded.`);
    } else {
      // if booking start time is less than 24 hours, no refund
      await cancelBooking(booking._id);
      setBookings((bookings) => bookings.filter((b) => b._id !== booking._id));
      Swal.fire(
        "Congratulations",
        "Booking cancelled. No refund will be provided.",
        "success"
      );
      // alert("Booking cancelled. No refund will be provided.");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Modal
        title="Edit Room Details"
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
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
      </Modal>

      <h2 className="text-center text-info mb-5">Edit or Cancel Bookings:</h2>

      {loadData ? (
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Room</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.email}</td>

                <td>{booking.roomName}</td>
                <td>{new Date(booking.startTime).toLocaleString()}</td>
                <td>{new Date(booking.endTime).toLocaleString()}</td>
                <td>{booking.price}</td>
                <td>
                  <button onClick={() => handleEdit(booking)}>Edit</button>
                  <button onClick={() => handleDelete(booking)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Edit;

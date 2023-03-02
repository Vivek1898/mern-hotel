import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
const FormUse = ({
  handleSubmit,
  formData,
  handleInputChange,
  handleDateChange,
  handleRoomSelect,
  rooms,
  bookingPrice,
  loading,
}) => {
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-row">
        <label>Email:</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label>Start time:</label>
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={(event) => handleDateChange(event, "startTime")}
        />
      </div>

      <div className="form-row">
        <label>End time:</label>
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={(event) => handleDateChange(event, "endTime")}
        />
      </div>

      <div className="form-row">
        <label>Room:</label>
        <select name="room" value={formData.roomId} onChange={handleRoomSelect}>
          <option value="">Select a room</option>
          {rooms.map((room) => (
            <option key={room._id} value={room._id}>
              {room.name} - {room.pricePerHour}Rs/h
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <p>Booking Price: {bookingPrice}</p>
      </div>

      <div className="form-row">
        {loading ? (
          <Button
            type="primary"
            className="loading-btn"
            icon={<LoadingOutlined />}
            loading
          />
        ) : (
          <button type="submit">{loading ? "loading" : "Add Room"} </button>
        )}
        {/* <button type="submit" className="submit-button">Book</button> */}
      </div>
    </form>
  );
};

export default FormUse;

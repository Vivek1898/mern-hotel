import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "antd";
import { Space, Spin } from "antd";

const App = () => {
  const [bookings, setBookings] = useState([]);
  console.log(bookings);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_GLOBAL_API_URL}/api/rooms`
      );
      console.log(res.data);
      setRooms(res.data);
      setLoading(false);
    };
    const fetchBookings = async () => {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_GLOBAL_API_URL}/api/bookings`
      );
      setBookings(res.data);
      setLoading(false);
    };
    fetchRooms();
    fetchBookings();
  }, []);

  const uniqueEmails = new Set(bookings.map((b) => b.email));

  // Map the unique email addresses to filter options
  const emailFilters = Array.from(uniqueEmails).map((email) => ({
    text: email,
    value: email,
  }));
  const columns = [
    {
      title: "Booked By",
      dataIndex: "email",
      filters: emailFilters,
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.email.indexOf(value) === 0,
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Booking Price",
      dataIndex: "price",

      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "StartTime",
      dataIndex: "startTime",
      key: "dateStart",
      sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "dateEnd",
      sorter: (a, b) => new Date(a.endTime) - new Date(b.endTime),
    },
    {
      title: "Room Type",
      dataIndex: "type",
      filters: [
        {
          text: "Type A",
          value: "A",
        },
        {
          text: "Type B",
          value: "B",
        },
        {
          text: "Type C",
          value: "C",
        },
      ],
      onFilter: (value, record) => record.type.indexOf(value) === 0,
    },
    {
      title: "Room Name",
      dataIndex: "name",
      filters: rooms.map((room) => ({
        text: room.name,
        value: room.name,
      })),
      onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
      title: "Price Per Hour",
      dataIndex: "pricePerHour",
      // defaultSortOrder: 'descend',
      sorter: (a, b) => a.price - b.price,
    },
  ];

  const data = bookings.map((item) => {
    console.log(item.roomId);

    const data = [
      {
        email: item.email,
        price: item.price,
        startTime: item.startTime,
        endTime: item.endTime,
        _id: item.roomId._id,
        name: item.roomId.name,
        pricePerHour: item.roomId.pricePerHour,
        type: item.roomId.type,
      },
    ];

    return data;
  });
  const dataMerge = [].concat.apply([], data);

  return (
    <div>
      <h2 className="text-center text-primary mb-5">All Bookings</h2>
      {loading ? (
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      ) : (
        <Table columns={columns} dataSource={dataMerge} />
      )}
    </div>
  );
};

export default App;

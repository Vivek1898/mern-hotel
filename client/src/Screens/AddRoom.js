import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
const RoomForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    pricePerHour: '',
  });
  const [rooms, setRooms] = useState([]);
  const[loading,setLoading]=useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      const result = await axios.get( `${process.env.REACT_APP_GLOBAL_API_URL}/api/rooms`);
      setRooms(result.data);
    };

    fetchRooms();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
   const res= await axios.post( `${process.env.REACT_APP_GLOBAL_API_URL}/api/rooms/add`, formData);
      setRooms(  [...rooms, res.data]);
      Swal.fire("Congratulations", "Room Added Successfully ", "success");
      setFormData({
        name: '',
        type: '',
        pricePerHour: '',
      });
      setLoading(false);
    } catch (error) {
        Swal.fire("Opps", "Something went wrong , Try Again" , "error");
        setLoading(false);
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_GLOBAL_API_URL}/api/rooms/${id}`);
      setRooms(rooms.filter((room) => room._id !== id));
      Swal.fire("Congratulations", "Room Deleted Successfully ", "success");
    } catch (error) {
        Swal.fire("Opps", "Something went wrong , Try Again" , "error");
      console.log(error);
    }
  };

  return (
    <div>
     <h2 className=" text-info">Add Rooms</h2>
        <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Type:
          <select name="type" value={formData.type} onChange={handleInputChange}>
            <option value="">Select a type</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </label>
        <br />
        <label>
          Price per hour:
          <input type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleInputChange} />
        </label>
        <br />
        {loading ? <Button type="primary" className='loading-btn' icon={<LoadingOutlined />} loading /> : <button type="submit">{loading ? 'loading':"Add Room"}   </button>}
       
        
      </form>
    </div>

    <h2 className=" text-info">All Rooms</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Price per hour</th>
            {/* <th>Edit</th> */}
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id}>
              <td>{room.name}</td>
              <td>{room.type}</td>
              <td>{room.pricePerHour}</td>
              {/* <td>
                <button onClick={() => console.log('TODO: Implement edit room functionality')}>Edit</button>
              </td> */}
              <td>
                <button onClick={() => handleDelete(room._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomForm;

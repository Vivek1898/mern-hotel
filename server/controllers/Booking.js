const Booking = require('../models/Booking');
const Room = require('../models/Room');
const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.PWD_USER
    }
  });


// Create a new booking
exports.getAllBookings = async (req, res) => {
    try {
      const bookings = await Booking.find().populate('roomId');
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  };


  // Create a new booking
  exports.createBooking = async (req, res)  => {
    const { email, roomId, startTime, endTime  } = req.body.formData;
    console.log(req.body.formData)
   // return ;
    console.log(req.body)
    const pricet =req.body.bookingPrice;
    const price = Number(pricet);
  
    console.log(startTime);
  //   console.log(new Date(startTimestamp));
  
  const room= await Room.findById(roomId);
     
    const booking = new Booking({ email, roomId, startTime, endTime,price,roomName:room.name });
    try {
      await booking.save();
      const savedBooking = await Booking.findById(booking._id).populate('roomId');
  
      const emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Congratulations Room Booked Successfully`,
          html: `
        
          <p>Room Name   : - ${room.name}</p>
          <p>Room Rate   : - ${price}</p>
         
          <p>Start Time   : - ${new Date(startTime).toLocaleString()}</p>
          <p>End Time   : - ${new Date(endTime).toLocaleString()}</p>
          
          <hr />
         
      `
      };
      transporter.sendMail(emailData).then(sent => {
          console.log(sent)
          // return res.json({
          //     message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`
          // });
      });
      res.json(savedBooking);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  };

  // Update a booking by ID
  exports.updateBooking = async (req, res) => {
   
    try {
        const { email, roomId, startTime, endTime } = req.body.formData;
        const pricet =req.body.bookingPrice;
        const price = Number(pricet);
        console.log("Vivek")
     //   console.log(req.body)
     const room= await Room.findById(roomId);
     
        // const isExist = await Booking.findById(req.params.id);
        // console.log(isExist);
       
      const booking = await Booking.findByIdAndUpdate(req.params.id, { email, roomId, startTime, endTime, price ,roomName:room.name  }, { new: true });
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
       // email
       const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Congratulations Room Booking Updated Successfully`,
        html: `
      
        <p>Room Name   : - ${room.name}</p>
        <p>Room Rate   : - ${price}</p>
       
        <p>Start Time   : - ${new Date(startTime).toLocaleString()}</p>
        <p>End Time   : - ${new Date(endTime).toLocaleString()}</p>
        
        <hr />
       
    `
    };
    transporter.sendMail(emailData).then(sent => {
        console.log(sent)
        // return res.json({
        //     message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`
        // });
    });
      res.json({booking,room});

    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  };



    // Delete a booking by ID

    exports.deleteBooking = async (req, res) => {
        console.log('cancel booking')
        const { id } = req.params;
      
        try {
          const booking = await Booking.findById(id);
      
          if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
          }
      
          await Booking.findByIdAndDelete(id);
      
          return res.status(200).json({ message: 'Booking cancelled' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Something went wrong' });
        }
      };

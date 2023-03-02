// server.js

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
//routes
const bookingRouter = require('./routes/BookingRoute');
const roomRouter = require('./routes/RoomRoute');


const app = express();


  // Connect to MongoDB
  mongoose
  .connect(process.env.DATABASE_LOCAL, { useNewUrlParser: true })
  .then(() => console.log('DB connected'))
  .catch(err => {
     
      console.log(err);
  });

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(cors ({origin: '*'}));



app.use('/api', bookingRouter);
app.use('/api', roomRouter);

// Start the server
app.listen(5000, () => {
  console.log('Server started on port 5000');
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser=require('body-parser');
const env=require('dotenv');
const app = express();
env.config();

// Middleware
app.use(cors({
    origin: "*",
  }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
//Server
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
//Routes
app.use('/auth', require('./routes/auth'));
app.use('/creator', require('./routes/Creator'));
app.use('/business', require('./routes/Business'));
app.use('/equity-request', require('./routes/equity'));
// Connect to MongoDB

mongoose.connect(process.env.MONGO_URI, { family: 4 })
.then(()=>console.log("Connected to DB"))
.catch(err=> console.error(err));


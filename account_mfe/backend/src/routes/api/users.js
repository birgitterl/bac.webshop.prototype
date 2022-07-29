const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

// Register a new user
router.post('/', async (req, res) => {
  const {
    username,
    password,
    name,
    email,
    emp_no,
    street,
    number,
    zip,
    city,
    country,
  } = req.body;
  let user = null;

  let state = mongoose.connection.readyState;
  if (state !== 1) {
    return res.status(503).json({
      status: 503,
      msg: 'Service unavailable',
    });
  }

  try {
    // See if user exists
    user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({
        status: 400,
        msg: 'User already exists - Please choose another username',
      });
    }

    user = new User({
      username: username,
      password: password,
      name: name,
      email: email,
      emp_no: emp_no,
      shipping_address: {
        street: street,
        number: number,
        zip: zip,
        city: city,
        country: country,
      },
    });

    // Encrypt password with bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to MongoDB
    await user.save();

    return res.status(201).json({
      status: 201,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
    });
  }
});

// Delete all registered users (for testing only)
router.delete('/', async (req, res) => {
  let state = mongoose.connection.readyState;
  if (state !== 1) {
    return res.status(503).json({
      status: 503,
      msg: 'Service unavailable',
    });
  }
  try {
    await User.remove();
    return res.status(200).json({
      status: 200,
      msg: 'OK - All users removed',
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
    });
  }
});

// Get all users (for testing only)
router.get('/', async (req, res) => {
  let state = mongoose.connection.readyState;
  if (state !== 1) {
    return res.status(503).json({
      status: 503,
      msg: 'Service unavailable',
    });
  }
  try {
    const users = await User.find().select('-password -_id -__v');
    if (!users.length) {
      return res.status(404).json({
        status: 404,
        msg: 'No users found',
      });
    } else {
      res.status(200).json({
        status: 200,
        users,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: 'Internal server error',
    });
  }
});

module.exports = router;

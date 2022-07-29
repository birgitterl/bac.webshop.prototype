const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

// Login user and get token
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  let state = mongoose.connection.readyState;
  if (state !== 1) {
    return res.status(503).json({
      status: 503,
      msg: 'Service unavailable',
    });
  }

  try {
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        status: 404,
        msg: 'Invalid Username. Please try again.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({
        status: 404,
        msg: 'Invalid Password. Please try again',
      });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    };

    jwt.sign(payload, 'mysecrettoken', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({ status: 200, token });
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
    });
  }
});

// get current user
router.get('/', auth, async (req, res) => {
  let state = mongoose.connection.readyState;
  if (state !== 1) {
    return res.status(503).json({
      status: 503,
      msg: 'Service unavailable',
    });
  }
  try {
    const user = await User.findById(req.user.id).select('-password -_id -__v');
    if (user === null) {
      return res.status(404).json({
        status: 404,
        msg: 'No user found',
      });
    }
    return res.status(200).json({
      status: 200,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
    });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  emp_no: {
    type: Number,
    required: true,
  },
  shipping_address: {
    street: {
      type: String,
    },
    number: {
      type: Number,
    },
    zip: {
      type: Number,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
  },
});

module.exports = User = mongoose.model('user', UserSchema);

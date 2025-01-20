const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Especifica explícitamente el nombre de la colección (esto no es estrictamente necesario)
const User = mongoose.model('User', userSchema, 'users'); // 'users' es el nombre de la colección en MongoDB

module.exports = User;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  idU: {
    type: Number,
    require: true,
    unique: true,
  },
  nombreU: {
    type: String,
    trim: true,
    require: true,
  },
  passwordU: {
    type: String,
    require: true,
  },
  correoU: {
    type: String,
    trim: true,
    require: true,
    unique: true,
  },
  telU: {
    type: Number,
    require: true,
  },
  rolU: {
    type: String,
    trim: true,
    require: true,
    default: 'Aspirante',
  },
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;

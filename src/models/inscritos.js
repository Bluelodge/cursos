const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inscritosSchema = new Schema({
  idEst: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  },
  idCur: {
    type: Schema.Types.ObjectId,
    ref: 'Cursos',
  },
});

const Inscritos = mongoose.model('Inscritos', inscritosSchema);

module.exports = Inscritos;

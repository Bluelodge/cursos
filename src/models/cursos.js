const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const cursosSchema = new Schema({
  nombreC: {
    type: String,
    trim: true,
    require: true,
    unique: true,
  },
  detalleC: {
    type: String,
    trim: true,
    require: true,
  },
  valorC: {
    type: String,
    require: true,
    set: function (precio) {
      valCur = new Intl.NumberFormat("es-CO").format(precio);
      return valCur;
    },
  },
  modC: {
    type: String,
    trim: true,
    default: '-',
  },
  tiempoC: {
    type: String,
    trim: true,
    default: '-',
  },
  estadoC: {
    type: String,
    default: 'Disponible',
  },
  codeC: {
    type: String,
    set: function (name) {
      codeCur = name.replace(/ /g, '');
      return codeCur;
    },
  },
});

cursosSchema.plugin(AutoIncrement, { inc_field: 'idC' });

const Cursos = mongoose.model('Cursos', cursosSchema);

module.exports = Cursos;

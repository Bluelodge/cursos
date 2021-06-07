//REQUIRE
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');

var MemoryStore = require('memorystore')(session);
require('./helpers');

//PORT AND DB CONECTION
require('./config/config');

//PATHS
const dirPublico = path.join(__dirname, './../public');
const dirViews = path.join(__dirname, './../templates/views');
const dirPartials = path.join(__dirname, './../templates/partials');
app.use(express.static(dirPublico));

//SESSION
app.use(session({
  cookie: { maxAge: 86400000 }, //24h
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: 'calypso',
  resave: true,
  saveUninitialized: true,
}));

app.use((req, res, next) => {
  if (req.session.usuario) {
    res.locals.sesion = true;
    res.locals.nombre = req.session.nombre.toUpperCase();
    if (req.session.tipo == 'Aspirante') {
      res.locals.sesionUsuario = true;
    } else if (req.session.tipo == 'Coordinador') {
      res.locals.sesionCoordinador = true;
    }
  }

  next();
});

//VIEWS
app.set('view engine', 'hbs');
app.set('views', dirViews);
hbs.registerPartials(dirPartials);

//BODYPARSER
app.use(bodyParser.urlencoded({ extended: false }));

//INDEX
app.use(require('./routes/index.js'));

//DB CONECTION
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true }, (err, resultado) => {
  if (err) {
    return console.log(`Error al conectar a base de datos ${err}`);
  }
  console.log('Conectado a base de datos');
});

//PUERTO
app.listen(port, () => {
  console.log('Servidor en el puerto ' + port);
});

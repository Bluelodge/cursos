const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');

require('./helpers');

const funcionesC = require('./funCursos.js');
const funcionesR = require('./funRegistros.js');

//PATHS
const dirPublico = path.join(__dirname, '../public');
const dirViews = path.join(__dirname, '../templates/views');
const dirPartials = path.join(__dirname, '../templates/partials');
app.use(express.static(dirPublico));

app.set('view engine', 'hbs');
app.set('views', dirViews);
hbs.registerPartials(dirPartials);

app.use(bodyParser.urlencoded({ extended: false }));

//HOME
app.get('/', (req, res) => {
  res.render('index', {
    title: 'INICIO',
  });
});

//CREAR CURSOS
app.get('/crear', (req, res) => {
  res.render('crear', {
    title: 'CREAR',
  });
});

//CURSO CREADO
app.post('/crear', (req, res) => {
  res.render('crear', {
    title: 'CURSOS',
    idC: parseInt(req.body.id),
    nombreC: req.body.nombre,
    detalleC: req.body.desc,
    valorC: parseInt(req.body.valor),
    modC: req.body.mod,
    tiempoC: req.body.tiempo,
  });
});

//VER CURSOS
app.get('/cursos', (req, res) => {
  res.render('cursos', {
    title: 'CURSOS',
  });
});

app.post('/cursos', (req, res) => {
  res.render('cursos', {
    title: 'CURSOS',
    idC: parseInt(req.body.id),
    idCur: parseInt(req.body.idCu),
  });
});

//INSCRIBIRSE
app.get('/inscribir', (req, res) => {
  res.render('inscribir', {
    title: 'INSCRIBIR',
  });
});

app.post('/inscribir', (req, res) => {
  res.render('inscribir', {
    title: 'INSCRIBIR',
    idU: parseInt(req.body.id),
    nombreU: req.body.nombre,
    correoU: req.body.email,
    telU: parseInt(req.body.tel),
    idC: parseInt(req.body.idC),
  });
});

//REGISTROS
app.get('/inscritos', (req, res) => {
  res.render('inscritos', {
    title: 'INSCRITOS',
  });
});

app.post('/inscritos', (req, res) => {
  res.render('inscritos', {
    title: 'INSCRITOS',
    idR: parseInt(req.body.idR),
    idU: parseInt(req.body.idU),
  });
});

//ERROR
app.get('*', (req, res) => {
  res.render('error', {
    title: 'ERROR 404 NOT FOUND'
  });
});

app.listen(3000);

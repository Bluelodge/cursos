//REQUIRE
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');

//PATHS
const dirPublico = path.join(__dirname, './../../public');
const dirViews = path.join(__dirname, './../../templates/views');
const dirPartials = path.join(__dirname, './../../templates/partials');
app.use(express.static(dirPublico));

//VIEWS
app.set('view engine', 'hbs');
app.set('views', dirViews);
hbs.registerPartials(dirPartials);

//MODELS
const Usuario = require('./../models/usuarios');
const Cursos = require('./../models/cursos');
const Inscritos = require('./../models/inscritos');

//HOME
app.get('/', (req, res) => {
  res.render('index', {
    title: 'INICIO',
  });
});

app.post('/', (req, res) => {
  mensaje = '';
  rol = '';
  Usuario.findOne({ idU: parseInt(req.body.idUsuario) }, (err, resultado) => {
    if (err) {
      return console.log(err);
    }

    if (resultado) {
      if (bcrypt.compareSync(req.body.passw, resultado.passwordU)) {
        req.session.usuario = resultado._id;
        req.session.nombre = resultado.nombreU;
        req.session.tipo = resultado.rolU;
        console.log(`Encontrado ${resultado}, con variable de sesion ${req.session.usuario}`);
        mensaje = `<div class="alert alert-success alert-dismissible fade show" role="alert"> BIENVENIDO@ ${resultado.nombreU}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
      } else {
        mensaje = `<div class="alert alert-danger alert-dismissible fade show" role="alert"> CONTRASEÑA INCORRECTA
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
        console.log('Contraseña incorrecta');
        res.render('index', {
          loggeado: mensaje,
        });
        return;
      }
    } else {
      mensaje = `<div class="alert alert-danger alert-dismissible fade show" role="alert"> USUARIO NO ENCONTRADO
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>`;
      console.log('Usuario no encontrado');
      res.render('index', {
        loggeado: mensaje,
      });
      return;
    }

    if (req.session.tipo == 'Aspirante') {
      res.render('index', {
        loggeado: mensaje,
        sesion: true,
        sesionUsuario: true,
        nombre: req.session.nombre.toUpperCase(),
      });
      console.log('Inicio sesion usuario Aspirante');
    } else if (req.session.tipo == 'Coordinador') {
      res.render('index', {
        loggeado: mensaje,
        sesion: true,
        sesionCoordinador: true,
        nombre: req.session.nombre.toUpperCase(),
      });
      console.log('Inicio sesion usuario Coordinador');
    }
  });
});

//REGISTRAR
app.get('/registro', (req, res) => {
  res.render('registro', {
    title: 'REGISTRO',
  });
});

app.post('/registro', (req, res) => {
  let usuario = new Usuario({
    idU: parseInt(req.body.id),
    nombreU: req.body.nombre,
    passwordU: bcrypt.hashSync(req.body.pass, 10),
    correoU: req.body.email,
    telU: parseInt(req.body.tel),
  });

  usuario.save((err, resultado) => {
    if (err) {
      res.render('index', {
        loggeado: `<div class="alert alert-danger alert-dismissible fade show" role="alert"> FALLO AL REGISTRAR
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`,
      });
      console.log(err);
      return;
    }

    res.render('index', {
      title: 'REGISTRO',
      loggeado: `<div class="alert alert-success alert-dismissible fade show" role="alert"> REGISTRO EXISTOSO
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>`,
    });
    console.log('Registro aspirante creado');
  });
});

//CREAR CURSOS
app.get('/crear', (req, res) => {
  //COORDINADOR
  if (res.locals.sesionCoordinador) {
    res.render('crearCurso', {
      title: 'CREAR',
    });
  } else {
    res.redirect('/');
  }
});

app.post('/crear', (req, res) => {
  let t;
  if (req.body.tiempo != '') {
    t = req.body.tiempo;
  }

  let curso = new Cursos({
    nombreC: req.body.nombre,
    detalleC: req.body.desc,
    valorC: req.body.valor,
    modC: req.body.mod,
    tiempoC: t,
    codeC: req.body.nombre,
  });

  curso.save((err, resultado) => {
    if (err) {
      res.render('crearCurso', {
        respuesta: `<div class="alert alert-danger alert-dismissible fade show" role="alert"> FALLO AL CREAR CURSO
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`,
      });
      console.log(err);
      return;
    }

    res.render('crearCurso', {
      title: 'CREAR',
      respuesta: `<div class="alert alert-success alert-dismissible fade show" role="alert"> CURSO CREADO
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>`,
    });
    console.log('Curso creado');
  });
});

//VER CURSOS
app.get('/cursos', (req, res) => {
  //COORDINADOR
  if (res.locals.sesionCoordinador) {
    Cursos.find({}, (err, resultado) => {
      res.render('cursosCord', {
        title: 'CURSOS',
        listaCursos: resultado,
      });
    });
  } else {
    //PUBLICO
    Cursos.find({ estadoC: 'Disponible' }, (err, resDisp) => {
      res.render('cursos', {
        title: 'CURSOS',
        curDisp: resDisp,
      });
    });
  }
});

app.post('/cursos', (req, res) => {
  //COORDINADOR
  Cursos.findOne({ _id: req.body.id }, (err, resp) => {
    if (resp.estadoC == 'Disponible') {
      Cursos.updateOne({ _id: resp._id }, { estadoC: 'Cerrado' }, { new: true, runValidators: true }, (err, respAct) => {
        Cursos.find({}, (err, resultado) => {
          res.render('cursosCord', {
            title: 'CURSOS',
            listaCursos: resultado,
          });
          console.log(`Antes: ${resp}`);
          console.log(`Despues: ${respAct}`);
          return;
        });
      });
    } else {
      Cursos.updateOne({ _id: resp._id }, { estadoC: 'Disponible' }, { new: true, runValidators: true }, (err, respAct) => {
        Cursos.find({}, (err, resultado) => {
          res.render('cursosCord', {
            title: 'CURSOS',
            listaCursos: resultado,
          });
          console.log(`Antes: ${resp}`);
          console.log(`Despues: ${respAct}`);
        });
      });
    }
  });
});

//INSCRIBIRSE
app.get('/inscribir', (req, res) => {
  //ASPIRANTE
  if (res.locals.sesionUsuario) {
    Cursos.find({ estadoC: 'Disponible' }, (err, respDisp) => {
      Usuario.findById(req.session.usuario, (err, respEst) => {
        res.render('inscribirAsp', {
          title: 'INSCRIBIR',
          disponibles: respDisp,
          nombreAspirante: respEst.nombreU,
          idAspirante: respEst._id,
        });
      });
    });
  } else {
    res.redirect('/');
  }

});

app.post('/inscribir', (req, res) => {
  Inscritos.findOne({ idEst: req.body.idE, idCur: req.body.idC }, (err, respuesta) => {
    console.log(respuesta);
    if (respuesta != null) {
      console.log('Repetido');
      res.render('index', {
        title: 'INICIO',
        mensaje: `<div class="alert alert-danger alert-dismissible fade show" role="alert"> YA ESTÁ INSCRITO EN ESTE CURSO
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`,
      });
      return;
    } else {
      let inscrito = new Inscritos({
        idEst: req.body.idE,
        idCur: req.body.idC,
      });

      Cursos.find({ estadoC: 'Disponible' }, (err, respDisp) => {
        Usuario.findById(req.session.usuario, (err, respEst) => {
          inscrito.save((err, resultado) => {
            if (err) {
              res.render('inscribirAsp', {
                title: 'INSCRIBIR',
                disponibles: respDisp,
                nombreAspirante: respEst.nombreU,
                idAspirante: respEst._id,
                texto: `<div class="alert alert-danger alert-dismissible fade show" role="alert"> FALLO AL REGISTRAR EN CURSO
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`,
              });
              return;
            }

            res.render('inscribirAsp', {
              title: 'INSCRIBIR',
              disponibles: respDisp,
              nombreAspirante: respEst.nombreU,
              idAspirante: respEst._id,
              texto: `<div class="alert alert-success alert-dismissible fade show" role="alert"> REGISTRO A CURSO EXISTOSO
                      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                      </div>`,
            });
          });
        });
      });
    }
  });
});

//INSCRITOS
app.get('/inscritos', (req, res) => {
  listado = [];
  //ASPIRANTE
  if (res.locals.sesionUsuario) {
    Inscritos.find({ idEst: req.session.usuario }).populate('idEst').populate('idCur').
    exec((err, resultado) => {
      if (err) return console.log(err);
      resultado.forEach(res => {
        listado.push({
          nombreCur: res.idCur.nombreC,
          detalleCur: res.idCur.detalleC,
          modalicdadCur: res.idCur.modC,
          tiempoCur: res.idCur.tiempoC,
          estadoCur: res.idCur.estadoC,
        });
      });
      console.log(resultado);
      res.render('inscritosAsp', {
        title: 'INSCRITOS',
        listaCursos: listado,
      });
    });
    return;
  } else if (res.locals.sesionCoordinador) {
    //COORDINADOR
    Cursos.find({ estadoC: 'Disponible' }, (err, respCur) => {
      Inscritos.find({}).populate('idCur').populate('idEst').
      exec((err, resultado) => {
        if (err) return handleError(err);
        resultado.forEach(res => {
          listado.push({
            idCurs: res.idCur.idC,
            idAsp: res.idEst.idU,
            nombreAsp: res.idEst.nombreU,
            correoAsp: res.idEst.correoU,
            telAsp: res.idEst.telU,
            inscripcion: res._id,
          });
        });
        console.log(resultado);
        res.render('inscritosCord', {
          title: 'INSCRITOS',
          listaCur: respCur,
          listaAsp: listado,
        });
      });

    });
    return;
  } else {
    res.redirect('/');
  }

});

app.post('/inscritos', (req, res) => {
  //COORDINADOR
  listadoPost = [];
  Inscritos.findOneAndDelete({ _id: req.body.idIns }, req.body, (err, respDel) => {
    if (err) {
      console.log(err);
      res.render('inscritosCord', {
        title: 'INSCRITOS',
        eliminado: `<div class="alert alert-alert alert-dismissible fade show" role="alert"> ERROR AL ELIMINAR INSCRIPCIÓN
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`,
      });
      return;
    }

    console.log(`Eliminado: ${respDel.idEst}`);
    Cursos.find({ estadoC: 'Disponible' }, (err, respCur) => {
      Inscritos.find({}).populate('idCur').populate('idEst').
      exec((err, resultado) => {
        if (err) return handleError(err);
        resultado.forEach(res => {
          listadoPost.push({
            idCurs: res.idCur.idC,
            idAsp: res.idEst.idU,
            nombreAsp: res.idEst.nombreU,
            correoAsp: res.idEst.correoU,
            telAsp: res.idEst.telU,
            inscripcion: res._id,
          });
        });
        console.log(resultado);
        res.render('inscritosCord', {
          title: 'INSCRITOS',
          listaCur: respCur,
          listaAsp: listadoPost,
          eliminado: `<div class="alert alert-success alert-dismissible fade show" role="alert"> ELIMINADO EXISTOSAMENTE
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`,
        });
      });
    });
  });
});

//CERRAR SESION
app.get('/salir', (req, res) => {
  req.session.destroy((err) => {
    if (err) return console.log(err);
  });
  res.redirect('/');
});

//ERROR
app.get('*', (req, res) => {
  res.render('error', {
    title: 'ERROR 404 NOT FOUND',
  });
});

module.exports = app;

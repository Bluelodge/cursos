const fs = require('fs');
listaCursos = [];
listaEstudiantes = [];
listaInscritos = [];

//TOMA LISTA DE REGISTROS
const cargarI = () => {
  try {
    listaInscritos = require('./registro.json');
    console.log(`Cargado registro`);
  } catch (err) {
    listaInscritos = [];
  }
};

//TOMA LISTA DE ESTUDIANTES
const cargarE = () => {
  try {
    listaEstudiantes = require('./estudiantes.json');
    console.log(`Cargado estudiantes`);
  } catch (err) {
    listaEstudiantes = [];
  }
};

//GUARDAR LISTA DE REGISTROS
const guardarI = () => {
  let datos = JSON.stringify(listaInscritos);
  fs.writeFile('src/registro.json', datos, (err) => {
    if (err) throw (err);
    console.log(`Actualizado registro: ${datos}`);
  });
};

//GUARDAR LISTA DE ESTUDIANTES
const guardarE = () => {
  let datos = JSON.stringify(listaEstudiantes);
  fs.writeFile('src/estudiantes.json', datos, (err) => {
    if (err) throw (err);
    console.log(`Actualizado estudiantes: ${datos}`);
  });
};

//CREA ESTUDIANTE Y REGISTRO
const crearInscrito = (estudiante, idU, idC) => {
  cargarE();
  cargarI();
  let tamaño = listaInscritos.length;
  let sig = 1;
  if (tamaño != 0) {
    sig = listaInscritos[tamaño - 1].idReg;
    sig ++;
  };
  let inscrito = {
    idReg: sig,
    idCurso: idC,
    idEst: idU,
  };
  let regDuplicado = listaInscritos.find(reg => reg.idEst == inscrito.idEst && reg.idCurso == inscrito.idCurso);
  let texto = ``;
  if (!regDuplicado) {
    let estExiste = listaEstudiantes.find(est => est.idUsuario == estudiante.idUsuario);
    if (estExiste) {
      listaInscritos.push(inscrito);
      actualizarE(estudiante.idUsuario, estudiante.nombreU, estudiante.correoU, estudiante.telU);
      console.log(`Registro creado y estudiante actualizado`);
      guardarI();
    } else {
      listaEstudiantes.push(estudiante);
      listaInscritos.push(inscrito);
      console.log(`Estudiante ingresado y registro creado`);
      guardarE();
      guardarI();
    };
    texto = `<div class="alert alert-success alert-dismissible fade show" role="alert"> REGISTRO EXITOSO
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
  } else {
    texto = `<div class="alert alert-danger alert-dismissible fade show" role="alert"> YA EXISTE UN ESTUDIANTE REGISTRADO CON ESTA CÉDULA
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    console.log(`El estudiante ya esta inscrito en este curso`);
  };
  return texto;
};

//SELECCINAR CURSOS ESTUDIANTE
const seleccionarC = () => {
  listaCursos = require('./cursos.json');
  let texto = `<label for="idC" class="form-label"> Cursos disponibles: </label>
              <select class="form-select" name="idC">`;
  listaCursos.forEach(cur => {
    if (cur.estadoC == 'Disponible') {
      texto += `<option value="${cur.idCurso}"> ${cur.nombreC} </option>`
    }
  });
  texto += `</select>`;
  return texto;
};

//ELIMINAR REGISTRO
const eliminarU = (idU, idR) => {
  cargarI();
  let eliminado = listaInscritos.find(reg => reg.idEst == idU && reg.idCurso == idR);
  let modificado = listaInscritos.filter(est => est != eliminado);
  if (modificado.length != listaInscritos.length) {
    listaInscritos = modificado;
    guardarI();
    texto = `<div class="alert alert-success alert-dismissible fade show" role="alert"> SE ELIMINÓ REGISTRO
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    console.log(`Registro eliminado`);
  } else {
    texto = `<div class="alert alert-danger alert-dismissible fade show" role="alert"> REGISTRO NO ELIMINADO
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    console.log(`No existe registro a eliminar`);
  }
  return texto;
};

//ACTUALIZAR DATOS ESTUDIANTE
const actualizarE = (id, nom, mail, tel) => {
  cargarE();
  let estudiante = listaEstudiantes.find(est => est.idUsuario == id);
  estudiante.nombreU = nom;
  estudiante.correoU = mail;
  estudiante.telU = tel;
  guardarE();
};

//VER LISTA INSCRITOS ADMINISTRADOR
const listarI = () => {
  listaCursos = require('./cursos.json');
  listaEstudiantes = require('./estudiantes.json');
  listaInscritos = require('./registro.json');
  let texto = ``;
  listaCursos.forEach(cur => {
    let cont = 0;
    if (cur.estadoC == 'Disponible') {
      texto += `<div class="col">
                <div class="accordion accordion-flush mb-3" id="registros">
                <div class="accordion-item">
                <h2 class="accordion-header" id="${cur.idCurso}">
                <button class="btn collapsed btn-outline-success w-100 insinfo text-uppercase" type="button" data-bs-toggle="collapse" data-bs-target="#${cur.code}" aria-expanded="false" aria-controls="${cur.code}">
                ${cur.nombreC}
                </button>
                </h2>
                <div id="${cur.code}" class="accordion-collapse collapse" aria-labelledby="${cur.idCurso}" data-bs-parent="#registros">
                <div class="accordion-body">
                <form action="/inscritos" method="post">
                <table class="table border-dark">
                <thead class="table-dark text-center">
                <th> ID </th>
                <th> NOMBRE </th>
                <th> CORREO </th>
                <th> TELÉFONO </th>
                <th> ELIMINAR </th>
                </thead>
                <tbody>`;
      listaInscritos.forEach(reg => {
        if (cur.idCurso == reg.idCurso) {
          if (listaEstudiantes.length != 0) {
            let estudiante = listaEstudiantes.find(est => est.idUsuario == reg.idEst);
            texto += `
            <tr><input type="hidden" name="idR" value="${cur.idCurso}"> <td> ${reg.idEst}
                  </td> <td> ${estudiante.nombreU}
                  </td> <td> ${estudiante.correoU}
                  </td> <td> ${estudiante.telU}
                  </td> <td> <button type="submit" class="btn btn-danger" name="idU" value="${estudiante.idUsuario}"> Eliminar </button>
                  </td> </tr>`;
            cont++;
          }
        }
      });
      if (cont == 0) texto += `<tr> <td colspan="5"> No hay registros para este curso </td> </tr>`;
      texto += `</tbody> </table> </form> </div> </div> </div> </div> </div>`;
    }
  });
  if (listaInscritos.length == 0) {
    texto = `No hay inscritos disponibles`;
  }
  return texto;
};

module.exports = {
  crearInscrito,
  eliminarU,
  listarI,
  seleccionarC,
};

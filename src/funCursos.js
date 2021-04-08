const fs = require('fs');
listaCursos = [];
listaEstudiantes = [];
listaInscritos = [];

//VER LISTA CURSOS ADMINISTRADOR
const listarC = () => {
  listaCursos = require('./cursos.json');
  let texto = ``;
  listaCursos.forEach(curso => {
      texto += `<tr> <td> ${curso.idCurso}
            </td> <td> ${curso.nombreC}
            </td> <td> ${curso.detalleC}
            </td> <td class="detalle"> $ ${curso.valorC}
            </td> <td> ${curso.modC}
            </td> <td> ${curso.tiempoC} h
            </td> <td> ${curso.estadoC}
            </td> <td> <button type="submit" class="btn btn-danger" name="idCu" value="${curso.idCurso}"> Eliminar </button>
            </td> </tr>`;
  });
  if (listaCursos.length == 0) texto += `<tr> <td colspan="5"> No hay cursos creados </td> </tr>`;
  return texto;
};

//VER LISTA CURSOS ESTUDIANTE
const listarCE = () => {
  listaCursos = require('./cursos.json');
  let texto = `<div class="row row-cols-3">`;
  let cont = 0;
  listaCursos.forEach(cur => {
    if (cur.estadoC == 'Disponible') {
      texto += `<div class="col"> <p class="d-grid col-12">
      <button class="btn btn-outline-success bg-light text-success btn-sm curinfo" type="button" data-bs-toggle="collapse" data-bs-target="#${cur.code}" aria-expanded="true" aria-controls="${cur.code}">
      <p> <span> Curso: </span> ${cur.nombreC} <span> Valor: </span> ${cur.valorC} </p> </button> </p>
      <div class="collapse" id="${cur.code}"> <div class="card card-body border-success border-2 mb-3">
      <span class="text-success"> CURSO: </span> ${cur.nombreC} <br/>
      <span class="text-success"> VALOR: </span> ${cur.valorC} <br/>
      <span class="text-success"> DESCRIPCIÓN: </span> ${cur.detalleC} <br/>
      <span class="text-success"> MODALIDAD: </span> ${cur.modC} <br/>
      <span class="text-success"> INTENSIDAD: </span> ${cur.tiempoC} horas <br/>
      </div> </div>
      </div>`;
      cont++;
    }
  });
  if (cont == 0) {
    texto = `<p> No hay cursos disponibles </p>`;
  } else {
    texto += `</div>`;
  }
  return texto;
};

//TOMA LISTA DE CURSOS
const cargarC = () => {
  try {
    listaCursos = require('./cursos.json');
    console.log(`Cargado cursos`);
  } catch (err) {
    listaCursos = [];
  }
};

//GUARDAR LISTA DE CURSOS
const guardarC = () => {
  let datos = JSON.stringify(listaCursos);
  fs.writeFile('src/cursos.json', datos, (err) => {
    if (err) throw (err);
    console.log(`Actualizado cursos: ${datos}`);
  });
};

//CREAR CURSO
const crearCurso = (curso) => {
  cargarC();
  let duplicado = listaCursos.find(cur => cur.idCurso == curso.idCurso);
  let texto = ``;
  if (!duplicado) {
    listaCursos.push(curso);
    console.log(`Curso creado`);
    guardarC();
    texto = `<div class="alert alert-success alert-dismissible fade show" role="alert"> CURSO CREADO CON EXITO
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
  } else {
    texto = `<div class="alert alert-danger alert-dismissible fade show" role="alert"> EL CURSO YA EXISTE
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    console.log(`Ya existe un curso con el mismo ID`);
  };
  return texto;
};

//CAMBIAR ESTADO
const estadoC = (idC) => {
    listaCursos = require('./cursos.json');
    console.log(idC);
    texto = `<div class="alert alert-success alert-dismissible fade show" role="alert"> ESTADO MODIFICADO
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    let buscar = listaCursos.find(cur=> cur.idCurso == idC);
    if (buscar.estadoC == 'Disponible') {
      buscar.estadoC = 'Cerrado';
      guardarC();
      console.log('Curso actualizado a Cerrado');
    } else if (buscar.estadoC == 'Cerrado') {
      buscar.estadoC = 'Disponible';
      guardarC();
      console.log('Curso actualizado a Disponible');
    } else {
      texto = `<div class="alert alert-danger alert-dismissible fade show" role="alert"> ESTADO NO MODIFICADO
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`;
    }
    return texto;
};

//ELIMINAR CURSO
const eliminarC = (idCur) => {
  if (idCur) {
    listaCursos = require('./cursos.json');
    console.log(idCur);
    let modificado = listaCursos.filter(cur => cur.idCurso != idCur);
    if (modificado.length != listaCursos.length) {
      listaCursos = modificado;
      guardarC();
      texto = `<div class="alert alert-success alert-dismissible fade show" role="alert"> SE ELIMINÓ CURSO
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`;
      console.log(`Curso eliminado`);
    } else {
      texto = `<div class="alert alert-danger alert-dismissible fade show" role="alert"> CURSO NO ELIMINADO
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`;
      console.log(`No existe curso a eliminar`);
    }
    return texto;
  }
};

//SELECCIONAR CURSO PARA ACTUALIZAR ESTADO
const selectCurso = () => {
  listaCursos = require('./cursos.json');
  let texto = ``;
  if (listaCursos.length > 0) {
    texto = `<label for="id" class="form-label d-inline pe-3"> CURSOS: </label>
            <select class="form-select w-25 d-inline" name="id">`;
    listaCursos.forEach(cur => {
      texto += `<option value="${cur.idCurso}"> ${cur.idCurso} - ${cur.nombreC} </option>`
    });
    texto += `</select>`;
  } else {
    texto = `<p> No hay cursos creados </p>`;
  }
  return texto;
};

module.exports = {
  crearCurso,
  eliminarC,
  estadoC,
  listarC,
  listarCE,
  selectCurso,
};

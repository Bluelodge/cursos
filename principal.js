const { cursos } = require('./datos.js');
const fs = require('fs');

function imprimirCursos() {
  for (let i = 0; i < cursos.length; i++) {
    let ti = 2000 * i + 1;
    let info = 'El curso ' + cursos[i].nombre + ' [ID: ' + cursos[i].id +
                '] tiene una duración de ' + cursos[i].tiempo + ' y un valor de ' + cursos[i].valor;
    setTimeout(() => {
      console.log(info);
    }, ti);
  }
};

if (!process.argv[2]) {
  console.log('El listado de cursos disponibles en el momento es:');
  imprimirCursos();
} else {
  const { argv } = require('./yargs.js');

  let cursoId = cursos.find(curso => curso.id === argv.i);
  if (cursoId != null) {
    res = 'El estudiante ' + argv.nombre + ' con cédula ' + argv.cedula +
          ', se ha pre-matriculado en el curso ' + cursoId.nombre + ' [ID: ' + cursoId.id +
          '] que tiene una duración de ' + cursoId.tiempo + ' y un valor de ' + cursoId.valor;

    fs.writeFile('matricula.txt', res, (err) => {
      if (err) throw (err);
      console.log('Se generó pre-matrícula al curso ' + cursoId.id +
                  '.\nPor favor revise el archivo creado.');
    });
  } else {
    console.log('Debe ingresar un ID de curso válido.');
    imprimirCursos();
  }
}

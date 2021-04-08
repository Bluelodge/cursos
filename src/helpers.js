const hbs = require('hbs');
const funcionesC = require('./funCursos.js');
const funcionesR = require('./funRegistros.js');

hbs.registerHelper('verCursos', () => {
    return funcionesC.listarC();
});

hbs.registerHelper('crearcurso', (idC, nombreC, detalleC, valorC, modC, tiempoC) => {
  if (idC) {
    if (tiempoC == '') {
      tiempoC = `-`;
    }
    valorC = new Intl.NumberFormat("es-CO").format(valorC);
    nomCod = nombreC.replace(/ /g, '');
    let curso = {
      idCurso: idC,
      nombreC: nombreC,
      detalleC: detalleC,
      valorC: valorC,
      modC: modC,
      tiempoC: tiempoC,
      estadoC: 'Disponible',
      code: nomCod
    };
    console.log(`Nuevo curso: ${idC} ${nombreC} ${detalleC} ${valorC}`);
    return funcionesC.crearCurso(curso);
  }
});

hbs.registerHelper('verDisponibles', () => {
  return funcionesC.listarCE();
});

hbs.registerHelper('estadoCurso', (idC) => {
  if (idC) {
    return funcionesC.estadoC(idC);
  }
});

hbs.registerHelper('eliminarCurso', (idCur) => {
  return funcionesC.eliminarC(idCur);
  console.log('ELIMINAR');
});

hbs.registerHelper('selectCur', () => {
  return funcionesC.selectCurso();
});

hbs.registerHelper('verInscritos', () => {
    return funcionesR.listarI();
});

hbs.registerHelper('crearegistro', (idU, nombreU, correoU, telU, idC) => {
  if (idU) {
    let estudiante = {
      idUsuario: idU,
      nombreU: nombreU,
      correoU: correoU,
      telU: telU,
    };
    console.log(`Nuevo registro: ${idU} ${nombreU} ${correoU} ${telU} ${idC}`);
    return funcionesR.crearInscrito(estudiante, idU, idC);
  }
});

hbs.registerHelper('cursoseleccion', () => {
    return funcionesR.seleccionarC();
});

hbs.registerHelper('eliminarRegistro', (idU, idR) => {
  if (idU) {
    return funcionesR.eliminarU(idU, idR);
  }
});

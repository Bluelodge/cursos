const hbs = require('hbs');

hbs.registerHelper('verInscritos', (listaCur, listaAsp) => {
  let texto = '';
  let cont;
  listaCur.forEach(cur => {
    texto += `<div class="col">
              <div class="accordion accordion-flush mb-3" id="registros">
              <div class="accordion-item">
              <h2 class="accordion-header" id="${cur._id}">
              <button class="btn collapsed btn-outline-success w-100 insinfo text-uppercase" type="button" data-bs-toggle="collapse" data-bs-target="#${cur.codeC}" aria-expanded="false" aria-controls="${cur.codeC}">
              ${cur.nombreC}
              </button>
              </h2>
              <div id="${cur.codeC}" class="accordion-collapse collapse" aria-labelledby="${cur._id}" data-bs-parent="#registros">
              <div class="accordion-body">
              <form action="/inscritos" method="post">
              <table class="table border-dark">
              <thead class="table-dark text-center">
              <th> ID </th>
              <th> NOMBRE </th>
              <th> CORREO </th>
              <th> TELEFONO </th>
              <th> ELIMINAR </th>
              </thead>
              <tbody>`;
    listaAsp.forEach(ins => {
      if (cur.idC == ins.idCurs) {
        texto += `<tr> <td> ${ins.idAsp}
                  </td> <td> ${ins.nombreAsp}
                  </td> <td> ${ins.correoAsp}
                  </td> <td> ${ins.telAsp}
                  </td> <td> <button type="submit" class="btn btn-danger" name="idIns" value="${ins.inscripcion}"> Eliminar </button>
                  </td> </tr>`;
      }
    });
    texto += `</tbody> </table> </form> </div> </div> </div> </div> </div>`;
  });
  return texto;
});

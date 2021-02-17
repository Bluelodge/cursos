const options = {
                idCurso: {
                  alias: 'i',
                },
                nombre: {
                  alias: 'n',
                },
                cedula: {
                  alias: 'c',
                },
              };

const argv = require('yargs')
            .command('inscribir', 'Inscripción a curso', options)
            .demandOption(['i', 'n', 'c'])
            .argv;

module.exports = { argv };

//PUERTO
port = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB;

if (process.env.NODE_ENV === 'local') {
  urlDB = 'mongodb://localhost:27017/cursosbeta';
} else {
  urlDB = 'mongodb+srv://admin:gAVVcSwHIgGQQ2JI@cursostdea.afpwh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;

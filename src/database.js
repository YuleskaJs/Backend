const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://fiumi:GTuxjr7wGvMBWcis@fiumi.2njal.mongodb.net/excelSubido')
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch(err => {
    console.error('Error de conexión', err);
  });

  module.exports = mongoose.connection
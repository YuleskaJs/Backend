const { Router } = require('express');
const { 
  getClientes, 
  getEncuestasFiltro, 
  login, 
  postEncuesta, 
  getEncuestas, 
  uploadFile, 
  limpiarBase, 
  exportar 
} = require('../controllers/datos.controller');
const { addUser, deleteUser, listUsers, updateUser } = require('../controllers/datos.controller');

const router = Router();

router.get('/exportar', exportar);

router.get('/api/clientes', getClientes);

router.post('/api/login', login);

router.post('/nuevaEncuesta', postEncuesta);
router.get('/encuestas', getEncuestas);
router.get('/encuestasFiltro', getEncuestasFiltro);

router.post('/upload', uploadFile);

router.delete('/limpiar-base', limpiarBase);

router.post('/users', addUser);
router.put('/users/:email', updateUser);
router.delete('/users/:email', deleteUser);
router.get('/users', listUsers);

module.exports = router;

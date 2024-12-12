const { Router } = require('express');
const router = Router();
const { getClientes, getEncuestasFiltro, postEncuesta, getEncuestas, uploadFile } = require('../controllers/datos.controller');

router.get("/api/clientes", (req, res, next) => {
  console.log('Ruta /api/clientes alcanzada');
  next();
}, getClientes);

router.post('/nuevaEncuesta', postEncuesta);

router.get('/encuestas', getEncuestas);

router.get('/encuestasFiltro', getEncuestasFiltro);

router.post('/upload', uploadFile);

module.exports = router;

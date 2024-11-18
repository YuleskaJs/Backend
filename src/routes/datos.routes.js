const { Router } = require('express');
const router = Router();
const ClienteController = require('../controllers/datos.controller');

router.get("/api/clientes", (req, res, next) => {
  console.log('Ruta /api/clientes alcanzada');
  next();
}, ClienteController.getClientes);

module.exports = router;

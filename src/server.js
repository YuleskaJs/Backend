const express = require('express');
const app = express();
// const multer = require('multer');
const path = require('path');
require('./database');
app.use(express.json());
const cors = require('cors');
app.use(cors());

// const upload = multer({ dest: './uploads/'})

app.set('port', process.env.PORT || 3000)

const frontendPath = path.join(__dirname, 'public')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(frontendPath))


const datosRoutes = require('./routes/datos.routes');
app.use(datosRoutes);

module.exports = app;

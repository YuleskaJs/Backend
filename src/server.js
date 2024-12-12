const express = require('express');
const app = express();
const path = require('path');
require('./database');
app.use(express.json());
const cors = require('cors');
app.use(cors());

app.set('port', process.env.PORT || 3000)

const frontendPath = path.join(__dirname, 'public')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(frontendPath))

app.use(require('./routes/datos.routes'));
app.use(require('./routes/encuesta.routes'));

module.exports = app;
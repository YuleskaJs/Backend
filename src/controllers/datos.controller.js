const path = require('path');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Encuesta = require('../models/encuesta');
const XLSX = require('xlsx');
const fs = require('fs');
const Cliente = require('../models/ArchivoModel');
const Archivo = require('../models/ArchivoModel');

const excelDateToJSDate = (excelDate) => {
  if (typeof excelDate === 'number') {
    return new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  }

  const parsedDate = new Date(excelDate);
  if (parsedDate instanceof Date && !isNaN(parsedDate)) {
    return parsedDate;
  }

  return null;
};

exports.exportar = async (req, res) => {
  try {
      const archivos = await Archivo.find().populate('encuestas');

      const encabezados = [
          'ClienteId',
          'Nombre',
          'Documento',
          'TelAjustado',
          'Profesional',
          'Servicio',
          'FechaServicio',
          'Filtro',
          'Procedimiento',
          'ExperienciaGlobal',
          'ComentarioAdicional',
          'Recomendacion',
          'CalificacionLlamada',
      ];

      const filas = archivos.flatMap(archivo => {
          return archivo.encuestas.map(encuesta => [
              archivo._id,
              archivo.nombre,
              archivo.documento,
              archivo.telAjustado,
              archivo.profesional,
              archivo.servicio,
              archivo.fechaServicio.toISOString(),
              encuesta.filtro,
              encuesta.procedimiento,
              encuesta.experienciaGlobal,
              encuesta.comentarioAdicional,
              encuesta.recomendacion,
              encuesta.calificacionLlamada,
          ].join('\t'));
      });

      const contenidoCSV = [encabezados.join('\t'), ...filas].join('\n');

      const filename = 'exportacion_encuestas.csv';
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.setHeader('Content-Type', 'text/csv');
      res.send(contenidoCSV);
  } catch (error) {
      console.error('Error al exportar datos:', error);
      res.status(500).json({ message: 'Error al exportar datos', error });
  }
};

exports.addUser = async (req, res) => {
  const { username, email, password, role, } = req.body;
  try {
    const user = new User({ username, email, password, role });
    await user.save();
    res.status(201).json({ message: 'Usuario agregado exitosamente', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar usuario', error });
  }
};

exports.deleteUser = async (req, res) => {
  const { email } = req.params;
  try {
    await User.findOneAndDelete({ email });
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar usuarios', error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const secretKey = "U0XKfD9JgUdEL81yHGLgKzi5zmIHZqXl"
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      const token = jwt.sign({ userId: user._id }, secretKey);
      
      res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', user: user, token: token, role: user.role });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
};

exports.limpiarBase = async (req, res) => {
  try {
    await Archivo.deleteMany({});
    console.log('Colección "archivos" limpiada exitosamente');
    await Encuesta.deleteMany({});
    console.log('Colección "encuestas" limpiada exitosamente');
    res.status(200).send('Colecciones "archivos" y "encuestas" limpiadas exitosamente');
  } catch (error) {
    console.error('Error al limpiar las colecciones:', error);
    res.status(500).send('Error al limpiar las colecciones');
  }
};

exports.updateUser = async (req, res) => {
  const { email } = req.params;
  const { username, password, role } = req.body;
  
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { username, password, role },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(200).json({ message: 'Usuario actualizado exitosamente', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error });
  }
};

exports.getEncuestas = async (req, res) => {
  try {
    const { documento, filtro } = req.query;

    let query = {};

    if (filtro) query.filtro = filtro;

    const encuestas = await Encuesta.find(query).populate('clienteId');

    const encuestasFiltradas = documento
      ? encuestas.filter(encuesta => encuesta.clienteId?.documento === documento)
      : encuestas;

    console.log('Encuestas obtenidas:', encuestasFiltradas);

    res.json(encuestasFiltradas);
  } catch (error) {
    console.error('Error al obtener las encuestas:', error);
    res.status(500).json({ message: 'Error al obtener las encuestas' });
  }
};

exports.getEncuestasFiltro = async (req, res) => {
  try {
    const { filtro } = req.query;

    const encuestas = await Encuesta.find({ filtro: filtro })
      .populate('clienteId');

    res.json(encuestas);

  } catch (error) {
    console.error('Error al obtener las encuestas:', error);
    res.status(500).json({ message: 'Error al obtener las encuestas' });
  }
};

exports.getClientes = async (req, res) => {
  try {
    console.log('Petición recibida para obtener los clientes');
    const clientes = await Cliente.find();
    
    const clientesLegibles = clientes.map(cliente => ({
      ...cliente.toObject(),
      fecha_servicio: cliente.fecha_servicio ? cliente.fecha_servicio.toISOString() : null,
      fecha_creacion: cliente.fecha_creacion ? cliente.fecha_creacion.toISOString() : null,
    }));

    console.log('Clientes encontrados:', clientesLegibles);
    res.json(clientesLegibles);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));  
  }
});

const upload = multer({ storage: storage });

exports.uploadFile = [
  upload.single('archivo'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    try {
      const filePath = req.file.path;
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet);

        const transformedData = rawData.map(item => {
        const fechaServicio = item['Fecha Servicio'];
      
        if (!fechaServicio) {
          console.error(`Fecha no proporcionada para la fila con nombre: ${item['Nombre']}`);
          throw new Error(`Fecha no válida en el archivo Excel: ${fechaServicio}`);
        }
      
        const validFechaServicio = excelDateToJSDate(fechaServicio);
        if (!validFechaServicio) {
          console.error(`Fecha no válida en la fila con nombre: ${item['Nombre']}, fecha: ${fechaServicio}`);
          throw new Error(`Fecha no válida en el archivo Excel: ${fechaServicio}`);
        }
      
        return {
          nombre: item['Nombre'],
          tipodoc: item['tipodoc'],
          documento: item['documento'],
          telefono: item['telefono'],
          telAjustado: item['Tel. Ajustado'],
          email: item['email'],
          fechaServicio: validFechaServicio,
          profesional: item['Profesional'],
          servicio: item['Servicio'],
          filtro: item['filtro'] || '',
        };
      });

      await Archivo.insertMany(transformedData);
      console.log('Datos guardados en la base de datos');
      res.send('Archivo procesado y datos guardados exitosamente');
    } catch (err) {
      console.error('Error al procesar y guardar los datos:', err);
      res.status(500).send(`Error al guardar los datos en la base de datos: ${err.message}`);
    }
  }
];

const corregirFechas = async () => {
  const documentos = await Archivo.find();

  for (const doc of documentos) {
    if (typeof doc.fechaServicio === 'string' || isNaN(doc.fechaServicio.getTime())) {
      const fechaCorregida = excelDateToJSDate(doc.fechaServicio);
      if (fechaCorregida) {
        doc.fechaServicio = fechaCorregida;
        await doc.save();
      }
    }
  }

  console.log('Fechas corregidas');
};

corregirFechas().catch(err => console.error('Error al corregir fechas:', err));

exports.postEncuesta = async (req, res) => {
  const { clienteId, ...formularioData } = req.body;

  try {
    let encuesta = await Encuesta.findOne({ clienteId });

    if (encuesta) {
      encuesta = await Encuesta.findOneAndUpdate({ clienteId }, { ...formularioData }, { new: true });
      console.log('Encuesta actualizada exitosamente');
    } else {
      encuesta = new Encuesta({ clienteId, ...formularioData });
      await encuesta.save();
      console.log('Encuesta guardada exitosamente');
    }

    res.status(200).json(encuesta);
  } catch (error) {
    console.error('Error al guardar o actualizar la encuesta:', error);
    res.status(500).json({ message: 'Error al guardar o actualizar la encuesta', error });
  }
};

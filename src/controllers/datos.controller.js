const path = require('path');
const Cliente = require('../models/ArchivoModel');
const multer = require('multer');
const Encuesta = require('../models/encuesta');  
const XLSX = require('xlsx');
const Archivo = require('../models/ArchivoModel');

exports.getEncuestas = async (req, res) => {
  try {
    const { documento, filtro } = req.query;

    if (!documento || !filtro) {
      return res.status(400).json({ message: 'Se requiere el documento y el filtro' });
    }

    const encuestas = await Encuesta.find({ filtro: filtro })
      .populate('clienteId')

    const encuestasFiltradas = encuestas.filter(encuesta => encuesta.clienteId.documento === documento);

    console.log('Encuestas filtradas:', encuestasFiltradas);
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
      .populate('clienteId')

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

      const transformedData = rawData.map(item => ({
        nombre: item['Nombre'], 
        tipodoc: item['tipodoc'],
        documento: item['documento'],
        telefono: item['telefono'],
        telAjustado: item['Tel. Ajustado'],
        email: item['email'],
        fechaServicio: new Date(item['Fecha Servicio']),
        profesional: item['Profesional'],
        servicio: item['Servicio'],
        filtro: item['filtro'] || '',
      }));
      await Archivo.insertMany(transformedData);
      console.log('Datos guardados en la base de datos');
      res.send('Archivo procesado y datos guardados exitosamente');
    } catch (err) {
      console.error('Error al procesar y guardar los datos:', err);
      res.status(500).send('Error al guardar los datos en la base de datos');
    }
  }
];

exports.postEncuesta = async (req, res) => {
  const { clienteId, ...formularioData } = req.body;

  try {
    let encuesta = await Encuesta.findOne({ clienteId });

    if (encuesta) {
      
      encuesta = await Encuesta.findOneAndUpdate(
        { clienteId },
        { $set: formularioData }, 
        { new: true } 
      );
      return res.status(200).json({ message: 'Encuesta actualizada', encuesta });
    } else {
    
      encuesta = new Encuesta({ clienteId, ...formularioData });
      await encuesta.save();
      return res.status(201).json({ message: 'Encuesta creada', encuesta });
    }
  } catch (error) {
    console.error('Error al procesar la encuesta:', error.message);
    return res.status(500).json({ message: 'Error al procesar la encuesta', error: error.message });
  }
};

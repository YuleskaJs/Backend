// const Datos = require('../models/datos')
// const xlsx = require('xlsx');
const Cliente = require('../models/cliente');

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



// function leerExcel(req,res) {
//     console.log('Archivo recibido:', req.file);

//     if (!req.file) {
//         return res.status(400).json({ error: 'No se recibió un archivo Excel.' });
//       }

//     const archivoExcelPath = req.file.path;
//     const workbook = xlsx.readFile(archivoExcelPath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const jsonData = xlsx.utils.sheet_to_json(sheet);

//     console.log('Datos leídos del Excel:', jsonData);

//     const datosParaGuardar = jsonData.map(row => ({
//         nombre: row['Nombre'],
//         telefonoAjustado: row['Tel. Ajustado'],
//         fechaServicio: new Date(row['Fecha Servicio']),
//         profesional: row['Profesional'],
//         servicio: row['Servicio']
//       }));

//       guardarDatosEnMongo(datosParaGuardar, res);

// }


// function leerExcel(req,res) {
//     const uploadsFolder = path.join(__dirname, 'uploads');
  
//     fs.readdir(uploadsFolder, (err, files) => {
//       if (err) {
//         return res.status(500).json({ error: 'Error al leer la carpeta' });
//       }
  
//       const excelFiles = files.filter(file => file.endsWith('.xlsx'));
  
//       if (excelFiles.length === 0) {
//         return res.status(404).json({ message: 'no se encontraron archivos Excel en la carpeta.' });
//       }
  
//       const archivoExcelPath = path.join(uploadsFolder, excelFiles[0]);
  
//       const workbook = xlsx.readFile(archivoExcelPath);
      
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
      
//       const jsonData = xlsx.utils.sheet_to_json(sheet);
  
//       console.log(jsonData);
      
//       const datosParaGuardar = jsonData.map(row => ({
//         nombre: row['Nombre'],   
//         telefonoAjustado: row['Tel. Ajustado'],
//         fechaServicio: new Date(row['Fecha Servicio']),
//         profesional: row['Profesional'],
//         servicio: row['Servicio']
//       }));
  
//       guardarDatosEnMongo(datosParaGuardar, res);
//     });
//   }
  
//   function guardarDatosEnMongo(datos, res) {
//     Datos.insertMany(datos)
//       .then(() => {
//         res.status(200).json({ message: "los datos fueron guardados correctamente." })
//       })
//       .catch(err => {
//         res.status(500).json({ error: "error al guardar los datos "})
//       });
//   }

  
// module.exports = { leerExcel}
  
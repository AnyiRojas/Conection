import Evento from "../models/Evento.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Obtener el nombre del archivo actual y el directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EventoController {
  // Obtener todos los eventos
  static async obtenerEventos(req, res) {
    try {
      const eventos = await Evento.getAllEventos();
      res.status(200).json(eventos);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      res.status(500).json({ message: 'Error al obtener eventos', error });
    }
  }

  // Obtener evento por ID
  static async obtenerEventoPorId(req, res) {
    const { id_evento } = req.params;
    try {
      const evento = await Evento.getEventoById(id_evento);
      if (!evento) {
        return res.status(404).json({ message: 'Evento no encontrado' });
      }
      res.status(200).json(evento);
    } catch (error) {
      console.error('Error al obtener evento por ID:', error);
      res.status(500).json({ message: 'Error al obtener evento', error });
    }
  }

  static async crearEvento(req, res) {
    // Verificar si el archivo fue enviado
    if (!req.files || !req.files.foto_evento) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }

    const uploadedFile = req.files.foto_evento;
    const timestamp = Date.now();
    const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
    const uploadDir = path.join(__dirname, '../uploads/img/evento/');
    const uploadPath = path.join(uploadDir, uniqueFileName);
    const foto_eventoURL = `https://conection-ood1.onrender.com/uploads/img/evento/${uniqueFileName}`;

    // Asegurarse de que la carpeta exista
    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al crear el directorio', error: err });
      }

      // Mover el archivo subido a la carpeta correspondiente
      uploadedFile.mv(uploadPath, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error al subir la imagen', error: err });
        }

        try {
          // Recibe los datos del evento desde el body de la solicitud
          const { nombre_evento, descripcion } = req.body;

          if (!nombre_evento || !descripcion) {
            return res.status(400).json({ message: 'Faltan datos requeridos' });
          }

          // Prepara los datos del evento
          const eventoData = {
            nombre_evento,
            foto_evento: `./uploads/img/evento/${uniqueFileName}`, // Ruta del archivo en el servidor
            foto_eventoURL,
            descripcion
          };

          // Guarda el evento en la base de datos
          await Evento.createEvento(eventoData.nombre_evento, eventoData.foto_evento, eventoData.foto_eventoURL, eventoData.descripcion);

          res.status(201).json({ message: 'Evento creado correctamente' });
        } catch (error) {
          console.error('Error al crear evento:', error);
          res.status(500).json({ message: 'Error al crear evento', error });
        }
      });
    });
  }

  // Actualizar evento por ID
  static async actualizarEvento(req, res) {
    const { id_evento } = req.params;
    const { nombre_evento, descripcion } = req.body;

    let foto_eventoURL = null;
    let foto_evento = null;

    if (req.files && req.files.foto_evento) {
      const uploadedFile = req.files.foto_evento;
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}_${uploadedFile.name}`;
      const uploadPath = path.join(__dirname, '../uploads/img/evento/', uniqueFileName);

      await uploadedFile.mv(uploadPath);
      foto_eventoURL = `https://conection-ood1.onrender.com/uploads/img/evento/${uniqueFileName}`;
      foto_evento = `./uploads/img/evento/${uniqueFileName}`;
    } else {
      const existingEvento = await Evento.getEventoById(id_evento);
      if (!existingEvento) {
        return res.status(404).json({ message: 'Evento no encontrado' });
      }
      foto_evento = existingEvento.foto_evento;
      foto_eventoURL = existingEvento.foto_eventoURL;
    }

    try {
      await Evento.updateEvento(id_evento, nombre_evento, foto_evento, foto_eventoURL, descripcion);
      res.json({ message: 'Evento actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      res.status(500).json({ message: 'Error al actualizar evento', error });
    }
  }

  // Eliminar evento por ID
  static async eliminarEvento(req, res) {
    const { id_evento } = req.params;
    try {
      await Evento.deleteEvento(id_evento);
      res.json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      res.status(500).json({ message: 'Error al eliminar evento', error });
    }
  }
}

export default EventoController;

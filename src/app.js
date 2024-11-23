import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import serveIndex from 'serve-index';
import { fileURLToPath } from 'url';

// Importa las rutas
import AuthRouter from './routes/AuthRouter.js';
import carritoItemRoutes from './routes/carritoItemRoutes.js';
import carritoRoutes from './routes/carro.routes.js';
import eventoRoutes from './routes/evento.routes.js';
import fechaEspecialRoutes from './routes/fechaespecial.routes.js';
import opcionadicionalRoutes from './routes/opcionadicionalRouter.js';
import pagoRoutes from './routes/pago.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';
import pedidoitemRoutes from './routes/pedidoItemRoutes.js';
import productoRoutes from './routes/producto.routes.js';
import tipoFlorRoutes from './routes/tipoflor.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';

// Configuración de paths
const __filename = fileURLToPath(import.meta.url);  // Define __filename
const __dirname = path.dirname(__filename);         // Define __dirname

process.env.TZ = 'America/Bogota';
// Inicializa la aplicación Express
const app = express();

// Middleware
app.use(cors({
  origin: 'https://distribuidora-psi.vercel.app', // Cambia esto al origen de tu frontend
  credentials: true // Permite el envío de cookies y encabezados de autenticación
}));

app.use(express.json());
app.use(fileUpload({
  createParentPath: true,
}));

// Asegura que se pueda acceder a los archivos estáticos (imágenes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint para listar imágenes
app.get('/api/images/producto', (req, res) => {
  const dirPath = path.join(__dirname, 'uploads/img/producto');

  // Log para verificar la ruta
  console.log('Ruta del directorio de imágenes:', dirPath);

  // Verifica si el directorio existe
  fs.exists(dirPath, (exists) => {
    if (!exists) {
      return res.status(404).send('Directorio no encontrado.');
    }

    fs.readdir(dirPath, (err, files) => {
      if (err) {
        console.error('Error al leer el directorio:', err);
        return res.status(500).send('Error al leer el directorio.');
      }

      // Filtra solo las imágenes válidas
      const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
      res.json(images);
    });
  });
});

// Configuración para servir otros directorios
app.use('/uploads/img/pedido', serveIndex(path.join(__dirname, 'uploads/img/pedido'), { icons: true }));
app.use('/uploads/img/fecha_especial', serveIndex(path.join(__dirname, 'uploads/img/fecha_especial'), { icons: true }));
app.use('/uploads/img/tipo_flor', serveIndex(path.join(__dirname, 'uploads/img/tipo_flor'), { icons: true }));
app.use('/uploads/img/evento', serveIndex(path.join(__dirname, 'uploads/img/evento'), { icons: true }));

// Rutas de la API
app.use(usuarioRoutes, productoRoutes, opcionadicionalRoutes, pedidoRoutes, pedidoitemRoutes, carritoItemRoutes, pagoRoutes, carritoRoutes, eventoRoutes, tipoFlorRoutes, fechaEspecialRoutes, AuthRouter);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err.stack);
  res.status(500).json({ message: 'Algo salió mal. Intenta nuevamente más tarde.' });
});

export default app;

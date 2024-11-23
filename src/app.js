import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs'; // Asegúrate de importar fs
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
  origin: 'https://distribuidora-one.vercel.app', // Cambia esto al origen de tu frontend
  credentials: true // Permite el envío de cookies y encabezados de autenticación
}));

app.use(express.json());
app.use(fileUpload({
  createParentPath: true,
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint para listar imágenes
app.get('/api/images/producto', (req, res) => {
  const dirPath = path.join(__dirname, 'uploads/img/producto');
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).send('Error al leer el directorio.');
    }
    const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    res.json(images);
  });
});

app.use('/uploads/img/pedido', serveIndex(path.join(__dirname, 'uploads/img/pedido'), { icons: true }));
app.use('/uploads/img/fecha_especial', serveIndex(path.join(__dirname, 'uploads/img/fecha_especial'), { icons: true }));
app.use('/uploads/img/tipo_flor', serveIndex(path.join(__dirname, 'uploads/img/tipo_flor'), { icons: true }));
app.use('/uploads/img/evento', serveIndex(path.join(__dirname, 'uploads/img/evento'), { icons: true }));

// Monta las rutas con rutas base
app.use(usuarioRoutes, productoRoutes, opcionadicionalRoutes, pedidoRoutes, pedidoitemRoutes, carritoItemRoutes, pagoRoutes, carritoRoutes, eventoRoutes, tipoFlorRoutes, fechaEspecialRoutes, AuthRouter);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal. Intenta nuevamente más tarde.' });
});

app.use('/api', AuthRouter);

export default app;

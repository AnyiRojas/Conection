// routes/authRoutes.js
import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';

const router = Router();

// Ruta para solicitar restablecimiento de contraseña
router.post('/api/request-password-reset', AuthController.requestPasswordReset);

// Ruta para restablecer la contraseña con el token
router.post('/api/reset-password', AuthController.resetPassword);

// Redirigir al usuario a la página de restablecimiento de contraseña del frontend con el token en la URL
router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    res.redirect(`https://distribuidora-psi.vercel.app/reset-password/${token}`); // Redirige al frontend
});

export default router;
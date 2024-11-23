import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';
import Usuario from '../models/Usuario.js';

class AuthController {
    static async requestPasswordReset(req, res) {
        try {
            const { correo_electronico_usuario } = req.body;
            console.log('Correo electrónico recibido:', correo_electronico_usuario);

            const usuario = await Usuario.findOne({ where: { correo_electronico_usuario } });
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const token = crypto.randomBytes(32).toString('hex');
            const tokenExpiration = new Date(Date.now() + 3600000); // 1 hora

            usuario.token_recuperacion = token;
            usuario.fecha_token = tokenExpiration;
            await usuario.save();

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: usuario.correo_electronico_usuario,
                subject: 'Restablecer contraseña',
                text: `Haga clic en el siguiente enlace para restablecer su contraseña: https://conection-ood1.onrender.com/reset-password/${token}`,
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: 'Correo de restablecimiento de contraseña enviado' });
        } catch (error) {
            console.error('Error en la solicitud de restablecimiento:', error.message);
            res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { token, nueva_contrasena } = req.body;
            console.log('Token recibido:', token);
            console.log('Nueva contraseña recibida:', nueva_contrasena);
    
            const usuario = await Usuario.findOne({
                where: {
                    token_recuperacion: token,
                    fecha_token: { [Op.gt]: new Date() },
                },
            });
    
            if (!usuario) {
                console.log('Token inválido o expirado');
                return res.status(400).json({ message: 'Token inválido o expirado' });
            }
    
            const hash = await bcrypt.hash(nueva_contrasena, 10);
            usuario.contrasena_usuario = hash;
            usuario.token_recuperacion = null;
            usuario.fecha_token = null;
            await usuario.save();
    
            console.log('Contraseña actualizada correctamente');
            res.status(200).json({ message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            console.error('Error al restablecer contraseña:', error);
            res.status(500).json({ message: 'Error al restablecer la contraseña', error: error.message });
        }
    }
}

export default AuthController;
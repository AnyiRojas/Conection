import { Historial_Pedidos } from "../models/historial_Pedidos.model.js";

// Obtener todos los historial de pedidos
export const getHistorials = async (req, res) => {
    try {
        const historiales = await Historial_Pedidos.findAll();
        res.status(200).json(historiales);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los historiales de pedidos: ' + error });
    }
};

// Obtener un historial de pedido por ID
export const getHistorial = async (req, res) => {
    try {
        const id = req.params.id;
        const historial = await Historial_Pedidos.findByPk(id);
        if (historial) {
            res.status(200).json(historial);
        } else {
            res.status(404).json({ message: 'Historial de pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el historial de pedido: ' + error });
    }
};

// Crear un nuevo historial de pedido
export const postHistorial = async (req, res) => {
    try {
        const { fecha_consulta, detalles_pedido, usuario_id } = req.body;

        // Validar detalles_pedido
        if (!detalles_pedido || detalles_pedido.length < 1 || detalles_pedido.length > 255) {
            return res.status(400).json({ message: 'Detalles del pedido no válidos' });
        }

        await Historial_Pedidos.create({
            fecha_consulta,
            detalles_pedido,
            usuario_id
        });
        res.status(201).json({ message: 'Historial de pedido creado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el historial de pedido: ' + error });
    }
};

// Actualizar un historial de pedido
export const putHistorial = async (req, res) => {
    try {
        const id = req.params.id;
        const { fecha_consulta, detalles_pedido, usuario_id } = req.body;

        // Validar detalles_pedido
        if (!detalles_pedido || detalles_pedido.length < 1 || detalles_pedido.length > 255) {
            return res.status(400).json({ message: 'Detalles del pedido no válidos' });
        }

        const [updated] = await Historial_Pedidos.update({
            fecha_consulta,
            detalles_pedido,
            usuario_id
        }, {
            where: { id_historial: id }
        });

        if (updated) {
            res.status(200).json({ message: 'Historial de pedido actualizado correctamente' });
        } else {
            res.status(404).json({ message: 'Historial de pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el historial de pedido: ' + error });
    }
};

// Eliminar un historial de pedido
/*export const deleteHistorial = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Historial_Pedidos.destroy({ where: { id_historial: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Historial de pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el historial de pedido: ' + error });
    }
};
*/
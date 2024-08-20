import { Pedido } from '../models/Pedido.model.js';

// Obtener todos los pedidos
export const getPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll();
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos: ' + error });
    }
};

// Obtener un pedido por ID
export const getPedido = async (req, res) => {
    try {
        const id = req.params.id;
        const pedido = await Pedido.findByPk(id);
        if (pedido) {
            res.status(200).json(pedido);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el pedido: ' + error });
    }
};

// Crear un nuevo pedido
export const postPedido = async (req, res) => {
    try {
        const { fecha_pedido, estado_pedido, total_pagado, usuario_id, pago_id } = req.body;
        await Pedido.create({
            fecha_pedido,
            estado_pedido,
            total_pagado,
            usuario_id,
            pago_id
        });
        res.status(201).json({ message: 'Pedido creado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pedido: ' + error });
    }
};

// Actualizar un pedido
export const putPedido = async (req, res) => {
    try {
        const id = req.params.id;
        const { fecha_pedido, estado_pedido, total_pagado, usuario_id, pago_id } = req.body;

        // Asegurarse de que el estado es uno de los permitidos
        const estadosPermitidos = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];
        if (!estadosPermitidos.includes(estado_pedido)) {
            return res.status(400).json({ message: 'Estado de pedido no válido' });
        }

        const [updated] = await Pedido.update({
            fecha_pedido,
            estado_pedido,
            total_pagado,
            usuario_id,
            pago_id
        }, {
            where: { id_pedido: id }
        });

        if (updated) {
            res.status(200).json({ message: 'Pedido actualizado correctamente' });
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el pedido: ' + error });
    }
};

/*
// Eliminar un pedido
export const deletePedido = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Pedido.destroy({ where: { id_pedido: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el pedido: ' + error });
    }
};*/

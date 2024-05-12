const Venta = require('../models/ventas.js'); 
const Cliente = require('../models/clientes.js');
const Producto = require('../models/productos.js')

const httpVenta = {
    // Listar todas las ventas
    listarTodo: async (req, res) => {
        try {
            const ventas = await Venta.find();
            res.json(ventas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener una venta por su ID
    obtenerPorId: async (req, res) => {
        try {
            const venta = await Venta.findById(req.params.id);
            if (venta) {
                res.json(venta);
            } else {
                res.status(404).json({ message: 'Venta no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Listar ventas activas
    listarActivas: async (req, res) => {
        try {
            const ventasActivas = await Venta.find({ activo: true });
            res.json(ventasActivas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Listar ventas inactivas
    listarInactivas: async (req, res) => {
        try {
            const ventasInactivas = await Venta.find({ activo: false });
            res.json(ventasInactivas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Listar ventas de un cliente específico
    listarPorCliente: async (req, res) => {
        try {
            const ventasCliente = await Venta.find({ idcliente: req.params.id });
            res.json(ventasCliente);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Listar todas las ventas entre dos fechas
    listarPorRangoDeFechas: async (req, res) => {
        try {
            const { inicio, fin } = req.params;
            const ventasEnRango = await Venta.find({ fecha: { $gte: inicio, $lte: fin } });
            res.json(ventasEnRango);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Listar ventas con un valor superior a cierto valor
    listarPorValorSuperior: async (req, res) => {
        try {
            const { valor } = req.params;
    
            if (isNaN(valor)) {
                return res.status(400).json({ message: 'El valor proporcionado no es un número válido' });
            }
    
            const valorNumerico = parseFloat(valor);
    
            const ventasValorSuperior = await Venta.find({ ValorTotalVenta: { $gt: valorNumerico } });
    
            res.json(ventasValorSuperior);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    // Calcular el total de ventas entre dos fechas
    calcularTotalPorRangoDeFechas: async (req, res) => {
        try {
        const { inicio, fin } = req.params;
            const totalVentas = await Venta.aggregate([
                {
                    $match: {
                        fecha: { $gte: new Date(inicio), $lte: new Date(fin) }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$ValorTotalVenta" }
                    }
                }
            ]);
            res.json({ totalVentas: totalVentas.length > 0 ? totalVentas[0].total : 0 });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Calcular el total de descuento aplicado en todas las ventas
    calcularTotalDescuento: async (req, res) => {
        try {
            const totalDescuento = await Venta.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$descuento" }
                    }
                }
            ]);
            res.json(totalDescuento);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Insertar una nueva venta
     crear: async (req, res) => {
         const { idcliente, idproducto, fecha, ValorTotalVenta, descuento } = req.body;
        try {
            const venta = new Venta({ idcliente, idproducto, fecha, ValorTotalVenta, descuento });

            const nuevaVenta = await venta.save();

            res.status(201).json(nuevaVenta);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    
    // Actualizar una venta por su ID
    actualizar: async (req, res) => {
        try {
            const venta = await Venta.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (venta) {
                res.json(venta);
            } else {
                res.status(404).json({ message: 'Venta no encontrada' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Activar una venta por su ID
    activar: async (req, res) => {
        try {
            const venta = await Venta.findByIdAndUpdate(req.params.id, { activo: true }, { new: true });
            if (venta) {
                res.json({ msg: "Su venta esta Activa" });
            } else {
                res.status(404).json({ message: 'Venta no encontrada' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Desactivar una venta por su ID
    desactivar: async (req, res) => {
        try {
            const venta = await Venta.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
            if (venta) {
                res.json({ msg: "Su venta ha sido Desactivada" });;
            } else {
                res.status(404).json({ message: 'Venta no encontrada' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = {httpVenta}

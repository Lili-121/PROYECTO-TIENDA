const DetalleVenta = require('../models/detalle_ventas');
const Venta = require('../models/ventas')
const Producto = require('../models/productos.js')

const httpDetalle = {
    // Listar detalle de venta por ID de venta
    listarDetalleVentaPorIdVenta: async (req, res) => {
        const { idVenta } = req.params;
        try {
            const detallesVenta = await DetalleVenta.find({ idVenta });
            res.json(detallesVenta);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Insertar nuevo detalle de venta
    insertarDetalleVenta: async (req, res) => {
        const { idventa, idproductos, cantidad, descuento } = req.body;
        try {
            const producto = await Producto.findById(idproductos);
            if (!producto) {
                return res.status(404).json({ message: 'El producto no existe' });
            }

            const totalsin = cantidad * producto.precio;

            const total = totalsin * (1 - descuento / 100);

            const detalleVenta = new DetalleVenta({ idventa, idproductos, cantidad, descuento, total });
            await detalleVenta.save();

            const detallesVenta = await DetalleVenta.find({ idventa });
            const valorTotalVentas = detallesVenta.reduce((acumulador, detalle) => acumulador + detalle.total, 0);
            await Venta.findByIdAndUpdate(idventa, { ValorTotalVenta: valorTotalVentas });

            res.status(201).json(detalleVenta);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Modificar detalle de venta
    modificarDetalleVenta: async (req, res) => {
        const { id } = req.params;
        const { cantidad, descuento } = req.body;
        try {
            // Obtener el detalle de venta
            const detalleVenta = await DetalleVenta.findById(id);
            if (!detalleVenta) {
                return res.status(404).json({ message: 'Detalle de venta no encontrado' });
            }
            // Obtener el producto relacionado con el detalle de venta
            const producto = await Producto.findById(detalleVenta.idproductos);
            if (!producto) {
                return res.status(404).json({ message: 'El producto no existe' });
            }
            // Calcular los totales
            const totalsin = cantidad * producto.precio;
            const totalCondescuento = totalsin * (1 - descuento / 100);
            // Actualizar el detalle de venta
            const updatedDetalleVenta = await DetalleVenta.findByIdAndUpdate(id, { cantidad, totalCondescuento, totalsin }, { new: true });
            res.json(updatedDetalleVenta);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = { httpDetalle };
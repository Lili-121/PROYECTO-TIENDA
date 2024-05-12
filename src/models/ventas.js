const mongoose = require('mongoose');

const ventasSchema = new mongoose.Schema({
    idcliente:{type:mongoose.Schema.Types.ObjectId,ref:'Cliente'},
    idproducto: { type: mongoose.Schema.Types.ObjectId,ref:'Producto' },
    fecha:{ type: Date, required: true},
    ValorTotalVenta: { type: Number, default: 0 },
    descuento:{type:Number,default:0},
    activo: { type: Boolean, required: true, default: true }
}, { timestamps: true })

module.exports= mongoose.model("Venta", ventasSchema)
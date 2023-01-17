const { default: mongoose } = require("mongoose");

const PedidoSchema = new mongoose.Schema({
    nome:{
        type:String,
        required:true
    },
    cpf:{
        type:Number,
        required:true,
        unique:true
    },
    data:{
        type:Date,
        required:true
    },
    valor:{
        type:Number,
        required:true
    }
})

const Pedido =  mongoose.Schema("Pedido", PedidoSchema)

module.exports = Pedido
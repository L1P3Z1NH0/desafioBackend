const Pedido = require('../models/Pedido')

const create = (body) => Pedido.create(body)

module.exports = {
    create,
}
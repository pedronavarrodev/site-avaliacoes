import mongoose from 'mongoose'

const PedidoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  linkGoogle: {
    type: String,
    required: true,
  },
  quantidade: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pendente', 'pago', 'cancelado'],
    default: 'pendente',
  },
  precoTotal: {
    type: Number,
    required: true,
  },
  mercadoPagoId: {
    type: String,
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Pedido || mongoose.model('Pedido', PedidoSchema) 
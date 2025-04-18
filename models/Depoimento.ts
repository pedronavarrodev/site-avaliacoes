import mongoose, { Model } from 'mongoose'

const DepoimentoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  empresa: {
    type: String,
    required: true,
  },
  texto: {
    type: String,
    required: true,
  },
  foto: {
    type: String,
    default: '', // URL da foto
  },
  ativo: {
    type: Boolean,
    default: true,
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  },
})

// Verifica se o modelo já existe antes de criar um novo
const Depoimento = mongoose.models.Depoimento || mongoose.model('Depoimento', DepoimentoSchema)

export default Depoimento 
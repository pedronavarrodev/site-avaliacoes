import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Pedido from '@/models/Pedido'

export async function GET() {
  try {
    await dbConnect()
    const pedidos = await Pedido.find().sort({ dataCriacao: -1 })
    return NextResponse.json(pedidos)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar pedidos' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { pedidoId, status } = await request.json()
    
    // Validações básicas
    if (!pedidoId || !status) {
      return NextResponse.json(
        { error: 'ID do pedido e status são obrigatórios' },
        { status: 400 }
      )
    }

    if (!['pendente', 'pago', 'cancelado'].includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      )
    }

    await dbConnect()
    
    const pedido = await Pedido.findByIdAndUpdate(
      pedidoId,
      { 
        status,
        $set: { 
          "pagamento.status": status === 'pago' ? 'approved' : 
                             status === 'cancelado' ? 'cancelled' : 'pending',
          "pagamento.atualizadoEm": new Date()
        }
      },
      { new: true }
    )

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(pedido)
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido' },
      { status: 500 }
    )
  }
} 
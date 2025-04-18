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
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Depoimento from '@/models/Depoimento'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const data = await request.json()
    
    const depoimento = await Depoimento.findByIdAndUpdate(
      params.id,
      {
        nome: data.nome,
        empresa: data.empresa,
        texto: data.texto,
        foto: data.foto,
      },
      { new: true }
    )
    
    if (!depoimento) {
      return NextResponse.json(
        { error: 'Depoimento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(depoimento)
  } catch (error) {
    console.error('Erro ao atualizar depoimento:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar depoimento' },
      { status: 500 }
    )
  }
} 
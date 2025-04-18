import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Depoimento from '@/models/Depoimento'

export async function GET() {
  try {
    await dbConnect()
    const depoimentos = await Depoimento.find().sort({ dataCriacao: -1 })
    return NextResponse.json(depoimentos)
  } catch (error) {
    console.error('Erro ao buscar depoimentos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar depoimentos' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const data = await request.json()
    
    const novoDepoimento = new Depoimento({
      ...data,
      dataCriacao: new Date(),
      ativo: true
    })
    
    await novoDepoimento.save()
    return NextResponse.json(novoDepoimento)
  } catch (error) {
    console.error('Erro ao criar depoimento:', error)
    return NextResponse.json(
      { error: 'Erro ao criar depoimento' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID não fornecido' },
        { status: 400 }
      )
    }

    const depoimento = await Depoimento.findByIdAndDelete(id)
    
    if (!depoimento) {
      return NextResponse.json(
        { error: 'Depoimento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Depoimento removido com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar depoimento:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar depoimento' },
      { status: 500 }
    )
  }
} 
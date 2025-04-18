import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { senha } = await request.json()
    
    if (senha === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json(
      { error: 'Senha incorreta' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao autenticar' },
      { status: 500 }
    )
  }
} 